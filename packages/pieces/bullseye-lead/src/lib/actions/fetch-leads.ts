import { createAction, Property } from '@activepieces/pieces-framework';
import { httpClient, HttpMethod } from '@activepieces/pieces-common';

export const fetchLeads = createAction({
  name: 'fetch_leads', // Must be a unique across the piece, this shouldn't be changed.
  displayName: 'Fetch Leads',
  description: 'Fetch Leads',
  props: {
    apiKey: Property.ShortText({
      displayName: 'Bullseye ApiKey',
      description: '',
      required: true,
      defaultValue: '',
    }),
    clientId: Property.ShortText({
      displayName: 'Bullseye ClientId',
      description: '',
      required: true,
      defaultValue: '',
    }),
  },
  async run(context) {
    const date = new Date();
    date.setMinutes(date.getMinutes() - 5);

    // Formatear la fecha y hora según tus necesidades
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // Los meses comienzan en 0
    const day = date.getDate();
    const hour = date.getHours() + 2;
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    //07/12/2023
    //9/25/2023 10:27:43 PM
    const dateNow = `${month}/${day}/${year} ${hour}:${minutes}:${seconds}`;

    const BULLSEYE_API_URL = `https://ws.bullseyelocations-staging.com/RestLead.svc/GetLeads?ClientId=${context.propsValue['clientId']}&ApiKey=${context.propsValue['apiKey']}&CreatedAfter=${dateNow}`;

    console.log({ BULLSEYE_API_URL });
    return (
      await httpClient.sendRequest({
        method: HttpMethod.GET,
        url: `${BULLSEYE_API_URL}`,
      })
    ).body;
  },
});
