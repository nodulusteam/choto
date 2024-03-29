const snekfetch = require("snekfetch")

export class Videos {

    _baseURL: string;
	/**
	 * Create a new Video API wrapper
	 */
    constructor() {
        this._baseURL = "http://www.pornhub.com/webmasters"
    }

	/**
	 * Prepares the search url
	 * @function
	 * @returns {string}
	 */
    prepareSearchURL(queryData) {
        let url = `${this._baseURL}/search?`

        if (typeof queryData.category === 'string') {
            url += `&categories[]=${queryData.category}`
        } else if (Array.isArray(queryData.category)) {
            url += `&categories[]=${queryData.category.join(",")}`
        }

        if (typeof queryData.page === 'number') {
            if (queryData.page >= 0) {
                url += `&page=${queryData.page}`
            }
        }

        if (typeof queryData.search === 'string') {
            url += `&search=${queryData.search}`
        }

        if (typeof queryData.stars === 'string') {
            url += `&stars[]=${queryData.stars}`
        } else if (Array.isArray(queryData.stars)) {
            url += `&stars[]=${queryData.stars.join(",")}`
        }

        if (typeof queryData.tags === 'string') {
            url += `&tags[]=${queryData.tags}`
        } else if (Array.isArray(queryData.tags)) {
            url += `&tags[]=${queryData.tags.join(",")}`
        }

        if (typeof queryData.ordering === 'string') {
            url += `&ordering=${queryData.ordering}`
        }

        if (typeof queryData.period === 'string') {
            url += `&period=${queryData.period}`
        }

        if (typeof queryData.thumbsize === 'string') {
            url += `&thumbsize=${queryData.thumbsize}`
        } else if (queryData.thumbsize === undefined || queryData.thumbsize === null) {
            url += `&thumbsize=small`
        }

        return url
    }

	/**
	 * Sends the request and returns a promise
	 * @function
	 * @param {string} url - The URL to send the request to
	 */

    sendRequest(url) {
        return new Promise((resolve, reject) => {
            snekfetch.get(url).then(response => {
                const parsed = JSON.parse(response.text)
                resolve(parsed)
            }).catch((error) => {
                reject(error);
            })
        })
    }

	/**
	 * Retrieves video list, can be filtered by multiple parameters, including the possibility to query the API for videos containing a specific string in the title or description.
	 * @function
	 * @param {Object} queryData - The data to search for
	 * @param {string|Array.<string>|null} [queryData.category] - The categories to search for (Optional)
	 * @param {number|null} [queryData.page] - The page to search (Optional)
	 * @param {string|null} [queryData.search] - The text to search for (Optional)
	 * @param {string|Array.<string>|null} [queryData.stars] - The pornstars to search for (Optional)
	 * @param {string|Array.<string>|null} [queryData.tags] - The tags to search for (Optional)
	 * @param {string|null} [queryData.ordering] - How to sort the video responses. Possible values are `featured`, `newest`, `mostviewed` and `rating`
	 * @param {string|null} [queryData.period] - The time period to sort the video after. Possible values are `weekly`, `monthly` and `alltime` (Only works with the `ordering parameter`)
	 * @param {string} queryData.thumbsize - The size of the thumbnails. Possible values are `small`, `medium`, `large`, `small_hd`, `medium_hd` and `large_hd`
	 * @returns {Promise.<Object>}
	 */
    searchVideos(queryData) {

        const searchURL = this.prepareSearchURL(queryData)

        return this.sendRequest(searchURL)
    }

	/**
	 * Retrieves additional information about a specific video.
	 * @function
	 * @param {string} id - The ID of the video
	 * @param {string} [thumbsize] - The size of the thumbnails. Possible values are `small`, `medium`, `large`, `small_hd`, `medium_hd` and `large_hd`
	 * @returns {Promise.<Object>}
	 */
    getVideoById(videoID, thumbsize = 'small') {
        const url = `${this._baseURL}/video_by_id?id=${videoID}&thumbsize=${thumbsize}`

        return this.sendRequest(url)
    }

	/**
	 * Retrieves embed code for specific video by the videoID parameter, which is useful to automatically embed videos.
	 * @function
	 * @param {string} id - The ID of the video
	 * @returns {Promise.<Object>}
	 */
    getVideoEmbedCode(videoID) {
        const url = `${this._baseURL}/video_embed_code?id=${videoID}`

        return this.sendRequest(url)
    }

	/**
	 * Retrieves all deleted videos
	 * @function
	 * @param {number|string} page - The page to fetch
	 * @returns {Promise.<Object>}
	 */
    getDeletedVideos(page) {
        const url = `${this._baseURL}/deleted_videos?page=${page}`

        return this.sendRequest(url)
    }

	/**
	 * Retrieves state of a specific video specified by it's is_video_active parameter.
	 * @function
	 * @param {string} id - The ID of the video
	 * @returns {Promise.<Object>}
	 */
    isVideoActive(videoID) {
        const url = `${this._baseURL}/is_video_active?id=${videoID}`

        return this.sendRequest(url)
    }


}

