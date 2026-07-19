// SPDX-License-Identifier: Apache-2.0

import type { Metadata } from "next";
import Link from "next/link";
import { Callout, DocsHeader, DocsPager } from "@/components/DocsBlocks";

export const metadata: Metadata = { title: "AMM and YT routing" };

export default function AmmPage() {
  return (
    <article>
      <DocsHeader
        kicker="Protocol design"
        title="AMM and YT routing"
        summary="One pool prices PT, SY and YT together, on a curve that knows the clock is ticking. This page explains why an ordinary trading pool can't hold this market, how the curve works, and how YT trades through a pool that never holds YT."
      />

      <div className="docs-prose mt-8">
        <h2>First, what an AMM is</h2>
        <p>
          An AMM (automated market maker) is a trading venue with no order book and no
          counterparty to wait for. It is a pool holding two assets, and a formula that quotes a
          price from the pool&rsquo;s current balances. Anyone can trade against the pool at the
          quoted price, and anyone can deposit both assets into it (becoming a{" "}
          <strong>liquidity provider</strong>, or LP) to earn a cut of the trading fees.
        </p>

        <h2>Why the standard formula fails here</h2>
        <p>
          The classic AMM formula (Uniswap&rsquo;s constant product) assumes the two assets have no
          scheduled relationship over time. PT breaks that assumption: it <em>must</em> be worth
          exactly 1 SY on maturity day, by construction. Put PT in a standard pool and one of two
          bad things happens. Either the pool keeps overpricing PT along the way and arbitrage
          traders steadily drain the LPs as the price converges, or the pool underprices PT and
          nobody mints it in the first place.
        </p>
        <p>
          The fix is a formula with <strong>time built in</strong>, so the drift toward one dollar
          happens inside the pricing itself instead of being extracted from LPs trade by trade.
        </p>

        <h2>The time-decay curve</h2>
        <p>
          Sidereal uses the curve Pendle V2 adapted from Notional, two established fixed-rate
          protocols on Ethereum:
        </p>
        <pre>
          <code>{`rate_scalar   = scalar_root · YEAR / τ
exchange_rate = ln(p / (1 − p)) / rate_scalar + a

p = PT_reserve / (PT_reserve + SY_reserve)`}</code>
        </pre>
        <p>Three parameters shape it:</p>
        <ul>
          <li>
            <strong>Rate scalar (<code>r</code>)</strong>: how sharply the price reacts when the
            pool&rsquo;s balances shift. Higher means tighter prices near the going rate, but worse
            prices for trades that push the rate far.
          </li>
          <li>
            <strong>Rate anchor (<code>a</code>)</strong>: the rate the curve centers itself
            around, set from the underlying interest rate at deployment and updated as the market
            discovers its own level.
          </li>
          <li>
            <strong>Time to maturity (<code>τ</code>)</strong>: the countdown. As it approaches
            zero, v1&rsquo;s curve flattens onto one PT face unit per SY share. That equals
            underlying-asset par only while one SY share is worth one underlying unit.
          </li>
        </ul>
        <p>
          The curve concentrates liquidity around the current interest rate where trading happens,
          and its price can be read as a yearly rate. In deployed v1, however, PT is measured in
          underlying face units while the curve uses raw SY shares. Pendle converts those shares
          into asset units first. The missing conversion means v1&rsquo;s rate is share-denominated
          once the SY exchange rate moves above 1; the factory-built AMM corrects that before
          longer maturities launch. The displayed number is the{" "}
          <strong>implied APY</strong> you see in the app: the fixed rate the market is currently
          offering.
        </p>

        <h2>Integer math, by necessity</h2>
        <p>
          Stellar&rsquo;s smart-contract runtime rejects floating-point arithmetic outright, so
          the curve is reimplemented in whole-number (fixed-point) math. The build pipeline fails
          if any floating-point instruction sneaks into a contract. The AMM&rsquo;s randomized
          custody/reserve suite runs at SY rate 1.0; the factory-built AMM adds the non-par unit
          tests described above.
        </p>

        <h2>How YT trades through a PT pool</h2>
        <p>
          The pool only ever holds PT and SY. YT trades ride through it in one atomic transaction,
          using the split identity. Buying YT with SY:
        </p>
        <pre>{`1. Your SY goes to the market contract.
2. It borrows extra SY from the pool, inside the same transaction.
3. The combined SY is split into PT + YT.
4. The PT goes back to the pool, repaying the borrow.
5. The YT comes to you.`}</pre>
        <p>
          Selling YT runs the same loop backwards. Because Stellar transactions succeed or fail as
          a single unit, the borrow can never be left hanging: either every step lands or none do.
        </p>
        <p>
          The payoff of this design: <strong>all three assets share one pot of liquidity</strong>.
          Every YT trade is a PT trade underneath, so there is no separate, thinner YT pool, and
          the two prices can never drift apart. They are the same price read from opposite ends.
        </p>

        <h2>The built-in price average (TWAP)</h2>
        <p>
          Every trade updates a rolling 30-minute average of the implied rate, called a TWAP
          (time-weighted average price). It is useful for display during active trading. It is not,
          by itself, a collateral-grade oracle: after a long quiet spell, one trade resets the
          average and the warming-up flag expires 30 minutes later even if no second trade arrives.
          The grant-built oracle therefore also requires fresh observations, minimum in-window
          coverage, and a liquidity floor.
        </p>
        <p>
          This exists for a painfully local reason: in February 2026, an attacker manipulated an
          external price feed over a Blend pool on Stellar (the YieldBlox exploit) and drained
          $10.8M. Sidereal&rsquo;s pricing path uses no external feed at all. The interest rate
          comes straight from Blend on every interaction. The native TWAP is an oracle input, not
          a standalone manipulation-resistance guarantee.
        </p>

        <h2>What liquidity providers earn</h2>
        <p>LPs deposit PT and SY at the pool&rsquo;s current ratio and earn two things:</p>
        <ul>
          <li>
            <strong>Trading fees</strong>, set per pool at deployment (the live market charges
            0.1% on the embedded PT leg of each trade; a YT buy-and-sell round trip pays it twice).
          </li>
          <li>
            <strong>Curve convergence.</strong> V1 moves its PT-per-SY-share factor toward one as
            maturity nears. Because it omits the SY-share-to-asset conversion, this is not a
            guarantee of zero impermanent loss when an SY share is worth more than one underlying
            unit. The factory-built AMM normalizes the units before making that claim.
          </li>
        </ul>
        <p>
          Every pool operation accepts a minimum-you-will-accept bound. If the price moves against
          you between quote and execution beyond that bound, the transaction cancels itself rather
          than filling badly. See the <Link href="/guides/liquidity">liquidity guide</Link>{" "}
          for the practical walkthrough.
        </p>
      </div>

      <div className="mt-8">
        <Callout label="Known limitation: YT route dust">
          When the exchange rate is above 1.00, the YT route&rsquo;s rounding can strand a matched
          pair of PT and YT crumbs, worth less than one SY, in the pool&rsquo;s custody instead of
          the trader&rsquo;s hands. The crumbs never reach the trader, matched pairs are cleaned up
          pool-side, and both windows are covered by tests. A structural fix is deliberately
          deferred.
        </Callout>
      </div>

      <DocsPager current="/amm" />
    </article>
  );
}
