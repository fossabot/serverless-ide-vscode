"use strict"

import fs = require("fs")
import stringify = require("json-stable-stringify")
import map = require("lodash/map")
import path = require("path")
import request = require("request-promise")

const downloadSchema = async (): Promise<object> => {
	const response = await request.get(
		"https://raw.githubusercontent.com/awslabs/goformation/master/schema/cloudformation.schema.json",
		{ json: true }
	)

	return response
}

export const enrichResources = (schema: any) => {
	map(schema.definitions, definition => {
		if (definition.properties && definition.properties.DeletionPolicy) {
			definition.properties.UpdateReplacePolicy =
				definition.properties.DeletionPolicy
			definition.properties.Condition = {
				type: "string"
			}
		}
		if (definition.properties && definition.properties.DependsOn) {
			definition.properties.Condition = definition.properties.DependsOn
		}
	})
}

const generateSchema = (schema: any): any => {
	enrichResources(schema)

	return schema
}

const main = async () => {
	const schema = await downloadSchema()

	fs.writeFileSync(
		path.join(process.cwd(), "schema.json"),
		stringify(generateSchema(schema), { space: 4 }),
		"utf-8"
	)
}

main()
