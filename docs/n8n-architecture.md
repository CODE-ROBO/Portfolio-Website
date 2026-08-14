# n8n Automation Architecture

This document defines the webhook strategy for pushing live data from TDRSR simulations directly into the portfolio.

## Pipeline Trigger
1. **Simulation Completion:** TDRSR simulation script (e.g., Python/MATLAB) finishes running a trajectory model.
2. **HTTP POST Request:** The script sends a POST request to the n8n Webhook node.
   - **Payload:**
     ```json
     {
       "project": "Jericho NPTEL",
       "metric": "Trajectory Variance",
       "value": "2.4%",
       "status": "Verified"
     }
     ```

## n8n Workflow Steps
1. **Webhook Node:** Listens for the POST request.
2. **GitHub API Request (GET):** Fetches the current `src/data.json` from the repository.
3. **Data Manipulation Node (JavaScript):** Parses the JSON, locates the "RESEARCH TRACEABILITY" node, and pushes the new payload data to the node's tools or skills array.
4. **GitHub API Request (PUT):** Commits the updated `data.json` back to the `main` branch.

*Committing to `main` automatically triggers the GitHub Actions `deploy.yml` pipeline, rebuilding the site and publishing the live data within minutes.*
