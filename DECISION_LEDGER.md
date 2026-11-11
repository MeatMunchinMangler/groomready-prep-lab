# Moonshot App Lab — decision ledger v0.4 (2026-11-11 02:55 PST)

## Current state checked
- Mac online; existing Moonshot workspace contains `paradox-casefile-20261111`; its Git tree was clean at inspection and latest commit `e37df12`.
- PARADOX GitHub Pages build run 42999584436 completed successfully; FormFinish remains a separate already-shipped free experiment. Other Noriel Revenue worktrees were not modified.
- No user/payment analytics available; neither prior experiment has verified customers or revenue.

## Diverse commercial comparables (published prices, NOT verified sales)
- Pet-business workflow: Gingr Spa $109/month monthly; https://www.gingrapp.com/pricing — clear operator spending, but broad established incumbent.
- Freelancer receivables: Dunner $9/month freelancer, $29/month agency; https://dunner.io/ — crowded and email delivery/integrations add operational burden.
- Creator repurposing: OpusClip Starter $15/month; https://www.opus.pro/pricing — proven price point, heavy media compute and incumbent advantage.
- Trades invoicing: Trades Chaser $39/month base after intro; https://tradechaser.online/ — larger market, crowded and payment/accounting complexity.

## Decision
Build **GroomReady**, a sharply scoped *pet groomer appointment preparation share card* as a demand-testable workflow wedge, not a full kennel management suite. Hypothesis: solo groomers value reducing repetitive arrival questions, missing paperwork, and preventable appointment confusion. This hypothesis is NOT yet customer-validated; existing paid grooming suites show category willingness-to-pay, not demand for this feature. Avoid health or vaccination verification claims. Free tooling, static browser app, no sensitive records stored remotely, no automated customer outreach.

## Implementation and gates
- Isolated directory: `~/Documents/Moonshot App Lab/groomready-20261111`.
- Built HTML/JS user-facing prep-card generator, URL-based sharing, copy checklist, sample data, explicit privacy notice, safe text rendering.
- 8 Node assertions pass; local git commit created. Browser E2E, public hosting, real-user validation and payments NOT completed. No revenue, no customers, no external messages.
- Next gate: local browser smoke + mobile usability; then decide whether to publish public preview. Seek evidence from voluntary user testing before paid billing integration.

## Correction to avoid
Published competitor prices and marketing metrics are NOT proof of actual paying customers. A share-link with pet name is visible to anyone possessing it; warn users not to include private information.

## v0.5 — 2026-11-11 04:00 PST: deployment and competitive reassessment
- Inspected isolated GroomReady repo (`eb755b0`, clean before work), previous PARADOX/FormFinish deployment handoffs, and existing separate Moonshot projects. Avoided modifying other worktrees or orchestrators.
- Fresh official commercial comparables: FurryDesk Solo $39/month regular (promotional $19.50), https://www.furrydesk.com/pricing ; Withers Solo $59.99/month, https://www.withers.pet/ ; Dunner freelancer $9/month, https://dunner.io/ ; EstateHalo individual $49/year and professional $39/month, https://estatehalo.com/pricing . Prices are offers, NOT proof of buyers or revenue.
- Competitive correction: grooming platforms already bundle intake and reminders; GroomReady is NOT a validated differentiated paid business. The next test must establish real willingness to pay for a standalone share-card workflow before building billing. Freelancer receivables and estate organizers show alternative monetization but require sensitive data handling and/or integrations; no reason to displace this near-release test prematurely.
- Re-ran 8 assertions: passed. Created public GitHub repository https://github.com/MeatMunchinMangler/groomready-prep-lab and configured Pages at https://meatmunchinmangler.github.io/groomready-prep-lab/ . Initial Pages status building / HTTP 404: do NOT claim public release until HTTPS 200 and browser smoke pass.
- Data caution: card details are embedded in URL fragment; they are not sent to hosting server by ordinary HTTP requests, but can leak through sharing, screenshots, extensions or device history. No sensitive data, no analytics, no payment collection.
- Commercial status: prototype tested locally; public deployment pending verification; payment-enabled NO; verified buyers 0; verified revenue $0. No spend or outreach.
