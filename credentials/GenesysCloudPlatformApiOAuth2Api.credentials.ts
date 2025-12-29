import type { Icon, ICredentialTestRequest, ICredentialType, INodeProperties } from 'n8n-workflow';

export class GenesysCloudPlatformApiOAuth2Api implements ICredentialType {
	name = 'genesysCloudPlatformApiOAuth2Api';
	extends = ['oAuth2Api'];
	displayName = 'Genesys Cloud Platform API OAuth2 API';
	documentationUrl =
		'https://developer.genesys.cloud/authorization/platform-auth/use-client-credentials';
	icon: Icon = 'file:genesysCloud.svg';
	properties: INodeProperties[] = [
		{
			displayName: 'Grant Type',
			name: 'grantType',
			type: 'hidden',
			default: 'clientCredentials',
		},
		{
			displayName: 'Access Token URL',
			name: 'accessTokenUrl',
			type: 'hidden',
			default: '=https://login.{{$self["region"]}}/oauth/token',
		},
		{
			displayName: 'Authentication',
			name: 'authentication',
			type: 'hidden',
			default: 'body',
		},
		{
			displayName: 'Scope',
			name: 'scope',
			type: 'hidden',
			default: '',
		},
		{
			displayName: 'Token Key',
			name: 'tokenKey',
			type: 'hidden',
			default: 'access_token',
			typeOptions: { password: true },
		},
		{
			displayName: 'Refresh Token Key',
			name: 'refreshTokenKey',
			type: 'hidden',
			default: 'refresh_token',
			typeOptions: { password: true },
		},
		{
			displayName: 'Send Additional Body Properties',
			name: 'sendAdditionalBodyProperties',
			type: 'hidden',
			default: false,
		},
		{
			displayName: 'Allowed HTTP Request Domains',
			name: 'allowedHttpRequestDomains',
			type: 'hidden',
			default: '',
		},
		{
			displayName: 'Region',
			name: 'region',
			type: 'options',
			options: [
				{
					name: 'US East (Virginia) - mypurecloud.com',
					value: 'mypurecloud.com',
				},
				{
					name: 'US East 2 (Ohio) - use2.us-gov-pure.cloud',
					value: 'use2.us-gov-pure.cloud',
				},
				{
					name: 'US West (Oregon) - usw2.pure.cloud',
					value: 'usw2.pure.cloud',
				},
				{
					name: 'Canada (Central) - cac1.pure.cloud',
					value: 'cac1.pure.cloud',
				},
				{
					name: 'Europe (Ireland) - mypurecloud.ie',
					value: 'mypurecloud.ie',
				},
				{
					name: 'Europe (London) - euw2.pure.cloud',
					value: 'euw2.pure.cloud',
				},
				{
					name: 'Europe (Frankfurt) - mypurecloud.de',
					value: 'mypurecloud.de',
				},
				{
					name: 'Europe (Zurich) - euc2.pure.cloud',
					value: 'euc2.pure.cloud',
				},
				{
					name: 'Asia Pacific (Mumbai) - aps1.pure.cloud',
					value: 'aps1.pure.cloud',
				},
				{
					name: 'Asia Pacific (Tokyo) - mypurecloud.jp',
					value: 'mypurecloud.jp',
				},
				{
					name: 'Asia Pacific (Seoul) - apne2.pure.cloud',
					value: 'apne2.pure.cloud',
				},
				{
					name: 'Asia Pacific (Osaka) - apne3.pure.cloud',
					value: 'apne3.pure.cloud',
				},
				{
					name: 'Asia Pacific (Sydney) - mypurecloud.com.au',
					value: 'mypurecloud.com.au',
				},
				{
					name: 'South America (São Paulo) - sae1.pure.cloud',
					value: 'sae1.pure.cloud',
				},
				{
					name: 'Middle East (UAE) - mec1.pure.cloud',
					value: 'mec1.pure.cloud',
				},
			],
			default: 'mypurecloud.com',
			description: 'The Genesys Cloud region',
		},
	];

	test: ICredentialTestRequest = {
		request: {
			baseURL: '=https://api.{{$credentials.region}}',
			url: '/api/v2/tokens/me',
			headers: {
				'Content-Type': 'application/json',
			},
		},
	};
}
