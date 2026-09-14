# Governance and multisigs

For each Safe, read `getThreshold()` and `getOwners()`. In a new assessment,
record threshold, owner count, and whether the signers are publicly named or
anonymous. Use public attribution only; do not try to deanonymize individuals.

Check owner overlap between Safes presented as independent, owners that hold
other privileged roles, and contract owners. Describe material overlap directly
with linked addresses; an exhaustive signer list is unnecessary. Listing signer
addresses is not itself a review finding.

For reassessments, compare the **owner address set**, not just its count, and
threshold against the previous snapshot. A one-for-one owner replacement leaves
both count and threshold unchanged. Use historical `getOwners()` at the previous
snapshot block, a recorded owner set, or owner-change events since that snapshot.
If no reliable baseline can be recovered, mark continuity unverified and assess
the current composition; do not assume it is unchanged.

Revisit public attribution and overlap when the threshold or owner set changed,
or new evidence contradicts the previous characterization. Otherwise retain the
established characterization. Keep snapshot provenance available for the next
refresh without adding full signer lists to the report unless material.
