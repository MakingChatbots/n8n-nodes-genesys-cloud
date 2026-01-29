/**
 * Common types for Genesys Cloud API responses
 */

import type { IDataObject } from 'n8n-workflow';

/**
 * Base entity with ID and name
 */
export interface GenesysEntity {
	id: string;
	name: string;
	selfUri?: string;
	[key: string]: unknown;
}

/**
 * Genesys Cloud Queue
 */
export interface GenesysQueue extends GenesysEntity {
	description?: string;
	dateCreated?: string;
	dateModified?: string;
	modifiedBy?: string;
	createdBy?: string;
	memberCount?: number;
	mediaSettings?: IDataObject;
	acwSettings?: IDataObject;
	skillEvaluationMethod?: string;
	queueFlow?: IDataObject;
	callingPartyName?: string;
	callingPartyNumber?: string;
	division?: {
		id: string;
		name?: string;
		selfUri?: string;
	};
}

/**
 * Genesys Cloud User
 */
export interface GenesysUser extends GenesysEntity {
	email?: string;
	username?: string;
	department?: string;
	title?: string;
	state?: string;
	division?: {
		id: string;
		name?: string;
		selfUri?: string;
	};
	presence?: IDataObject;
	chat?: IDataObject;
	locations?: IDataObject[];
	groups?: IDataObject[];
	version?: number;
}

/**
 * Genesys Cloud Group
 */
export interface GenesysGroup extends GenesysEntity {
	type?: 'official' | 'social';
	description?: string;
	dateModified?: string;
	memberCount?: number;
	state?: string;
	version?: number;
	owners?: GenesysUser[];
	addresses?: IDataObject[];
}

/**
 * Genesys Cloud Division
 */
export interface GenesysDivision extends GenesysEntity {
	description?: string;
	homeDivision?: boolean;
	objectCounts?: IDataObject;
}

/**
 * Genesys Cloud Conversation
 */
export interface GenesysConversation {
	id?: string;
	conversationId?: string;
	conversationStart?: string;
	conversationEnd?: string;
	originatingDirection?: 'inbound' | 'outbound';
	participants?: IDataObject[];
	divisions?: IDataObject[];
	mediaStatsMinConversationMos?: number;
	mediaStatsMinConversationRFactor?: number;
	[key: string]: unknown;
}

/**
 * Paginated response from Genesys Cloud API
 */
export interface GenesysPaginatedResponse<T = IDataObject> {
	entities?: T[];
	pageSize?: number;
	pageNumber?: number;
	total?: number;
	pageCount?: number;
	cursor?: string;
	nextUri?: string;
	previousUri?: string;
	firstUri?: string;
	lastUri?: string;
	selfUri?: string;
}

/**
 * Analytics query response
 */
export interface GenesysAnalyticsResponse<T = IDataObject> {
	conversations?: T[];
	totalHits?: number;
	paging?: {
		pageSize: number;
		pageNumber: number;
	};
}

/**
 * Error response from Genesys Cloud API
 */
export interface GenesysApiError {
	message: string;
	code: string;
	status: number;
	messageWithParams?: string;
	messageParams?: Record<string, string>;
	contextId?: string;
	details?: Array<{
		errorCode: string;
		fieldName?: string;
		message: string;
	}>;
	errors?: Array<{
		errorCode: string;
		fieldName?: string;
		message: string;
	}>;
}