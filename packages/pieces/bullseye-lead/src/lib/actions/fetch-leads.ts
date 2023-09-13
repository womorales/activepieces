import { createAction, Property } from "@activepieces/pieces-framework";
import { httpClient, HttpMethod } from "@activepieces/pieces-common";

export const fetchLeads = createAction({
	name: 'fetch_leads', // Must be a unique across the piece, this shouldn't be changed.
  displayName:'Fetch Leads',
  description: 'Fetch Leads',
	props: {
        apiKey: Property.ShortText({
            displayName: 'Bullseye ApiKey',
            description: "",
            required: true,
            defaultValue: ""
          }),
          clientId: Property.ShortText({
            displayName: 'Bullseye ClientId',
            description: "",
            required: true,
            defaultValue: ""
          }),
	},
	async run(context) {
        const BULLSEYE_API_URL = `https://ws.bullseyelocations-staging.com/RestLead.svc/GetLeads?ClientId=${context.propsValue['clientId']}&ApiKey=${context.propsValue['apiKey']}&CreatedAfter=07/12/2023`;
        
        
        
		return (await httpClient.sendRequest({
			method: HttpMethod.GET,
			url: `${BULLSEYE_API_URL}`
		})).body;
	},
});