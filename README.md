# Genesys Cloud Node for n8n

An n8n community node for [Genesys Cloud's Platform API](https://developer.genesys.cloud/platform/api/).

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/sustainable-use-license/) workflow automation platform.

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Credentials

You need to authenticate with Genesys Cloud using OAuth 2.0 Client Credentials.

1.  Log in to your Genesys Cloud organization.
2.  Navigate to **Admin** > **Integrations** > **OAuth**.
3.  Click **Add Client**.
4.  Give the client a name (e.g. "n8n Automation").
5.  Under **Grant Types**, select **Client Credentials**.
6.  Click the **Roles** tab and assign the necessary roles for the resources you intend to access.
7.  Save the client.
8.  Copy the **Client ID** and **Client Secret**.

In n8n:
1.  Create a new credential type **Genesys Cloud API**.
2.  Enter your **Client ID** and **Client Secret**.
3.  Select your **Region** (e.g., `mypurecloud.com`, `mypurecloud.ie`, etc.).

## Operations

This node supports the following operations:

### Conversation
*   **Get**: Get a specific conversation by ID.
*   **Get Many**: Retrieve a list of conversations with filters (e.g., by Interval).

### Group
*   **Get**: Get a specific group by ID.
*   **Get Many**: Retrieve a list of groups.

### Queue
*   **Get**: Get a specific queue by ID.
*   **Get Many**: Retrieve a list of queues.

### User
*   **Get**: Get a specific user by ID.
*   **Get Many**: Retrieve a list of users.

## Resources

*   [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
*   [Genesys Cloud Platform API Documentation](https://developer.genesys.cloud/platform/api/)
