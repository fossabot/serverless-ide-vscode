import { DocumentType } from "../../../model/document"
import { YAMLDocument } from "../../../parser/index"
import { isEmpty } from "../../../model/globals"
import { ResolvedSchema } from ".."
import { applyGlobalsConfigMutations } from "./sam"
import { applyProviderMutations } from "./serverless"

export const applyDocumentMutations = (
	schema: ResolvedSchema | void,
	yamlDocument: YAMLDocument
): ResolvedSchema | void => {
	// early exit, if schema is not defined
	if (!schema) {
		return schema
	}

	if (yamlDocument.documentType === DocumentType.SAM) {
		const { globalsConfig } = yamlDocument

		if (isEmpty(globalsConfig)) {
			return schema
		}

		return applyGlobalsConfigMutations(schema, globalsConfig)
	}

	if (yamlDocument.documentType === DocumentType.SERVERLESS_FRAMEWORK) {
		return applyProviderMutations(schema, yamlDocument)
	}

	return schema
}
