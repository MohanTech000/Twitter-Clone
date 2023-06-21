# Twitter-Clone
Twitter clone project steps:

1: setup project
2: install express package and run server
3: install pug for view template
4: make another pug view template named as "main_Layouts.pug" (layouts folder is just for seprating for better code)
5: Now Create MiddleWares for checking user is logged In or Not
6: Now add login route
7: Create login page
8: Adding Bootstrap
9: add public folder for styling
10: login Css
11: make register page in views folder
12: make routes for register 
13: check if passwords matches or not 
14: install add body-parser package for seeing body data into console
15: checking for empty fields
16: connect with MongoDB dataBase 
17: create user Schema
18: checking if username and email is already in use in (routes/register_routes.js file)
19: Inserting a user info into MongoDB collection
20: Hashing a passwords using Bcrypt (package) 
21: creating sessions for security
22: User successfully login we show user info(such as his first name) in the homepage to user
23: setting logging in
24: create grid menu for home page
25: make it responsive
26: add font awesome to navigation bar
27: style navigation bar
28: add logout feature
29: add page title
30: add Mixins(Mixins allow you to create reusable blocks of Pug)
31: set default user picture
32: style postFormContainer
33: add commonJS file which control frontend work of(postFormContainer etc)
34: creating post API route in API folder
35: creating Posts Schemas
36: Adding posts to MongoDB(dataBase)
37: adding populate mongoose method( Population is the process of replacing the specified path in the document of one collection with the actual document)
// Now all the info of user(first name, email, porfile pic etc) will appear in "PostedBy".
38: add js file in homepage
39: Getting All posts (output)
40: Populating the posts
41: calculating post's timestamps
42: ordering the posts by newest first
43: adding like feature in Schema
44: adding likes/unlikes to users Schema
45: returning like result to the client
46: update the like button to show new number of likes
47: passing loggedIn info to client
48: setting up retweet
49: adding schema of retweets
50: creating reply model popup
51: outputting the post into the reply modal
52: clearing the reply modal when it is closed
53: Inserting reply into database(MongoDB)
54: redirect user into post page when he/she click on each post
55: load the post on the post page && replies
56: deleting post 
57: create profile route and style it
58: creating tabs on profile page
59: creating following/ followers schema
