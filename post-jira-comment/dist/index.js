/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 891:
/***/ ((module) => {

module.exports = eval("require")("@actions/core");


/***/ }),

/***/ 167:
/***/ ((module) => {

module.exports = eval("require")("@actions/github");


/***/ }),

/***/ 871:
/***/ ((module) => {

module.exports = eval("require")("node-fetch");


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
const core = __nccwpck_require__(891);
const github = __nccwpck_require__(167);
const fetch = __nccwpck_require__(871);


async function run()
{
    try
    {
        const context = github.context;
        const token = core.getInput('github_token', { required: true });
        const api = github.getOctokit(token);

        const jiraNumber = context.payload.pull_request.title.match(/^GS-[0-9]+/g);

        if (jiraNumber)
        {
            const issues = await core.group('Fetching existing comments', async () => {
                return await api.paginate(api.rest.issues.listComments.endpoint.merge({
                    owner: context.issue.owner,
                    repo: context.issue.repo,
                    issue_number: context.issue.number,
                }));
            });

            var previousCommentFound = false;

            for (const issue of issues)
            {
                if (issue.body.includes('Link to JIRA Ticket'))
                {
                    core.info('Found JIRA comment');
                    previousCommentFound = true;
                    break;
                }
            }

            if (!previousCommentFound)
            {
                const jiraTicketNumber = jiraNumber[0];

                var request = {
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Basic ${Buffer.from(`${core.getInput('jira_user')}:${core.getInput('jira_password')}`).toString('base64')}`,
                    }
                };

                var jiraResponse = await fetch(`https://socialgamingnetwork.jira.com/rest/api/latest/issue/${jiraTicketNumber}?fields=description`, request);
                var jiraJSON = await jiraResponse.json();

                core.debug(jiraJSON);

                if (jiraResponse.ok)
                {
                    var bodyString = `Link to JIRA Ticket: [${jiraTicketNumber}]\n\n`
                    bodyString += 'Please double check that your commits follow the [Git Commit Guidelines](https://socialgamingnetwork.jira.com/wiki/spaces/SFIOW/pages/1633026412/Git+Commit+Guidelines) :)\n\n'
                    bodyString += `[${jiraTicketNumber}]: https://socialgamingnetwork.jira.com/browse/${jiraTicketNumber}`
                    bodyString += '---\n'
                    bodyString += jiraJSON.fields.description

                    core.info(`No comment found. Adding new comment: '${bodyString}'`)

                    api.rest.issues.createComment({
                        owner: context.repo.owner,
                        repo: context.repo.repo,
                        issue_number: context.issue.number,
                        body: bodyString,
                    });
                }
                else
                {
                    core.setFailed('There was an issue with the JIRA API');
                }
            }
        }
        else
        {
          core.info('No JIRA ticket was found in the pull request title :(');
        }
    }
    catch (error)
    {
        core.setFailed(error.message);
    }
}

run();

})();

module.exports = __webpack_exports__;
/******/ })()
;