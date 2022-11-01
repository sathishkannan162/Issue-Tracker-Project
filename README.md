# Issue Tracker

This project was done as a part of Quality Assurance course on Freecodecamp and is a exact replica of [https://issue-tracker.freecodecamp.rocks/](https://issue-tracker.freecodecamp.rocks/).

In this project
- The backend of the web page was built and tests are written using `chai`, `mocha` and `zombie`. 
- `MongoDB` was used as database server and `mongoose` is used to validate documents.

There is a sample form on the homepage in which you can create, update, close and delete issues. 

You can also visit `{homeURL}/{project}` to go to a project page in which you can create, close and delete issues. All the issues will be shown as cards below the form. 

In this project, you can send
- GET requests to `\api\issues\{project}` to get the list of all issues in a project. 
    - You can do queries in the GET request to get only issues that meets certain conditions
- POST requests with all ids, or only required ids and the issue will be saved to the database.
- PUT request can update issues
-  DELETE request with _id will delete the issue.


## User Stories completed
- You can provide your own project, not the example URL.
- You can send a POST request to /api/issues/{projectname} with form data containing the required fields issue_title, issue_text, created_by, and optionally assigned_to and status_text.

- The POST request to /api/issues/{projectname} will return the created object, and must include all of the submitted fields. Excluded optional fields will be returned as empty strings. Additionally, include created_on (date/time), updated_on (date/time), open (boolean, true for open - default value, false for closed), and _id.

- If you send a POST request to /api/issues/{projectname} without the required fields, returned will be the error { error: 'required field(s) missing' }
- You can send a GET request to /api/issues/{projectname} for an array of all issues for that specific projectname, with all the fields present for each issue.
- You can send a GET request to /api/issues/{projectname} and filter the request by also passing along any field and value as a URL query (ie. /api/issues/{project}?open=false). You can pass one or more field/value pairs at once.
- You can send a PUT request to /api/issues/{projectname} with an _id and one or more fields to update. On success, the updated_on field should be updated, and returned should be {  result: 'successfully updated', '_id': _id }.
- When the PUT request sent to /api/issues/{projectname} does not include an _id, the return value is { error: 'missing _id' }.
- When the PUT request sent to /api/issues/{projectname} does not include update fields, the return value is { error: 'no update field(s) sent', '_id': _id }. On any other error, the return value is { error: 'could not update', '_id': _id }.
- You can send a DELETE request to /api/issues/{projectname} with an _id to delete an issue. If no _id is sent, the return value is { error: 'missing _id' }. On success, the return value is { result: 'successfully deleted', '_id': _id }. On failure, the return value is { error: 'could not delete', '_id': _id }.
- All 14 functional tests are complete and passing.



The project is hosted on replit: [https://Issue-Tracker-Project.sathishkannan16.repl.co](https://Issue-Tracker-Project.sathishkannan16.repl.co).