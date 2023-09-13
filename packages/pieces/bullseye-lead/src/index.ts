
import { createPiece, PieceAuth } from "@activepieces/pieces-framework";
import { fetchLeads } from "./lib/actions/fetch-leads";

export const bullseyeLead = createPiece({
  displayName: "Bullseye-lead",
  auth: PieceAuth.None(),
  minimumSupportedRelease: '0.8.0',
  logoUrl: "https://g5b7s6f6.stackpathcdn.com/wp-content/uploads/2021/07/bullseye-logo-1.png",
  authors: [],
  actions: [fetchLeads],
  triggers: [],
});
