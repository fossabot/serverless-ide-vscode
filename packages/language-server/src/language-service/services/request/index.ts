import { getErrorStatusDescription, xhr, XHROptions } from "request-light"
import { sendException } from "../analytics"

export default async (
	uri: string,
	options: XHROptions = {}
): Promise<string> => {
	try {
		const response = await xhr(
			Object.assign(
				{
					url: uri,
					followRedirects: 5,
					headers: { "Accept-Encoding": "gzip, deflate" }
				},
				options
			)
		)
		return response.responseText
	} catch (error) {
		sendException(error)
		return (
			error.responseText ||
			getErrorStatusDescription(error.status) ||
			error.toString()
		)
	}
}
