# Genesys Cloud Node for n8n
[![npm](https://img.shields.io/npm/v/@makingchatbots/n8n-nodes-genesys-cloud)](https://www.npmjs.com/package/@makingchatbots/n8n-nodes-genesys-cloud)
[![Follow me on LinkedIn for updates](https://img.shields.io/badge/Follow%20for%20updates-LinkedIn-blue)](https://www.linkedin.com/in/lucas-woodward-the-dev/)

An n8n community node for [Genesys Cloud's Platform API](https://developer.genesys.cloud/platform/api/).

<img width="3018" height="1325" alt="image" src="https://github.com/user-attachments/assets/2be20ca1-9adb-4e62-a776-1cc34ea7f799" />

## Installation

1. Expand **Settings**
2. Click **Community nodes**
3. Click **Install a community node**
4. Under **npm Package name** put `@makingchatbots/n8n-nodes-genesys-cloud`
5. Check _**'I understand the risks...'**_
6. Click **Install**

More detailed [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) is in the n8n community nodes documentation.

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


| Resource | Operation | Description |
| :--- | :--- | :--- |
| **Conversation** | Get | Get a conversation |
| | Get Many | Get many active conversations |
| **Data Action** | Get | Get a data action |
| | Get Many | Get many data actions |
| | Get Integrations | Get integrations for filtering data actions |
| **Division** | Get | Get a division |
| | Get Many | Get many divisions |
| **Group** | Get | Get a group |
| | Get Many | Get many groups |
| **OAuth Client** | Get | Get an OAuth client |
| | Get Many | Get many OAuth clients |
| | Get Usage | Get usage statistics for an OAuth client |
| **Queue** | Add Members | Add members to a queue |
| | Create | Create a queue |
| | Get | Get a queue |
| | Get Many | Get many queues |
| | Get Members | Get members of a queue |
| **User** | Get | Get a user |
| | Get Many | Get many users |
| | Get Queues | Get queues for a user |

## Resources

*   [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
*   [Genesys Cloud Platform API Documentation](https://developer.genesys.cloud/platform/api/)
