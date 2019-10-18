"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const github = __importStar(require("@actions/github"));
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const title = core.getInput('title');
            const urlPattern = core.getInput('urlPattern');
            const githubToken = core.getInput('githubToken');
            const octokit = new github.GitHub(githubToken);
            const context = github.context;
            const repo = context.repo.repo;
            console.log(process.env.GITHUB_REF);
            const ref = process.env.GITHUB_REF || '';
            const branch = ref.replace('refs/heads/', '');
            const url = urlPattern.replace('{repo}', repo).replace('{branch}', branch);
            yield octokit.issues.createComment(Object.assign({}, context.issue, { body: `**${title}:** ${url}` }));
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
run();
