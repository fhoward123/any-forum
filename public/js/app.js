const app = angular.module('forumApp', []);

app.controller('ThreadController', ['$http','$scope', function($http, $scope){
    this.newThread = {};
    this.updateThread = {};
    this.threads = [];
    this.deleteIndex = '';
    this.loggedInUser = '';
    this.loggedIn = false;
    this.showLogin = false;
    this.showSignup = false;
    this.loginErr = false;
    this.verifyPassword = '';
    this.errorMsg = '';
    this.includePath = 'partials/main-page.html'

    // Variables to track searching, sorting, and filtering
    this.currFilter = '';
    this.currOrder = '-createdAt';
    $scope.sortLeastLikes = function(thread) {
        return parseInt(thread.likes)
    };
    $scope.sortMostLikes = function(thread) {
        return - parseInt(thread.likes)
    };

    ///////////////////////////
    //      View Switching
    //////////////////////////
    this.changeInclude = (path) => {
        this.includePath = 'partials/' + path + '.html';
    }


    //////////////////////////
    //     Thread Methods
    //////////////////////////
    this.createThread = () => {
        $http({
            method: "POST",
            url: "/threads",
            data: this.newThread
        }).then( (response) => {
            console.log(response);
            this.threads.unshift(response.data);
            this.newThread = {};
        }, (err) => {
            console.log(err.message);
        });
    }

    this.getAllThreads = () => {
        $http({
            method: 'GET',
            url: '/threads'
        }).then( (response ) => {
            this.threads = response.data;
        }, (err) => {
            console.log(err.message);
        });
    };
    this.getAllThreads();

    this.deleteThread = (id) => {
        $http({
            method: 'DELETE',
            url: `/threads/${id}`
        }).then( (response) => {
            console.log(response);
            this.threads.splice(this.deleteIndex);
            this.deleteIndex = '';
        }, (err) => {
            console.log(err.message);
        });
    }

    this.updateThread = (thread) => {
        $http({
            method: 'PUT',
            url: `/threads/${thread._id}`,
            data: thread
        }).then( (response) => {
            console.log(response);
            thread = response.data
            let index = this.threads.findIndex( (e) => {
                return e._id === thread._id;
            })
            this.threads[index] = thread;
        },  (err) => {
            console.log(err.message);
        });
    }

    //Update Likes on a Thread
    this.addThreadLike = (thread) => {
        //thread.likes += 1;
        let addId = this.loggedInUser;
        //let addId = '5cdf34e0bee51d0979702ca8'

        if(thread['likeUsers']) {
            thread['likeUsers'][this.loggedInUser._id] = 1;
        } else {
            thread['likeUsers'] = { };
            thread['likeUsers'][this.loggedInUser._id] = 1;
        }
        this.updateThread(thread);
    }

    //Add a comment to a thread
    this.addComment = (thread) => {
        thread.comments.push(this.newComment);
        this.updateThread(thread);
        this.newComment = '';
    }

    // Click the new post button - redirect to login or allow post
    this.newPostClick = () => {
        if(this.loggedInUser === '') {
            console.log('User not logged in - redirect to login');
            this.showLogin = false;
            this.showSignup = false;
            this.loginErr = true;
            this.errorMsg = 'Please log in or register to make a post!'
        } else {
            console.log('Creating post.... <show create post view here>');
            this.changeInclude('new-thread');
        }
    }

    ////////////////////////////////
    //         User Auth
    ////////////////////////////////

    this.createUser = () => {
        if ( this.newPassword !== this.verifyPassword ) {
            this.errorMsg = "Passwords must match";
        }
        else {
            $http({
                method: 'POST',
                url: '/users',
                data: {
                    username: this.newUsername,
                    password: this.newPassword
                }
            }).then( (response) => {
                console.log(response);
                this.showSignup = ! this.showSignup;
            }, (error) => {
                console.log(error);
            });
        }
    };

    this.logIn = () => {
        $http({
            method: 'POST',
            url: '/sessions',
            data: {
                username: this.username,
                password: this.password
            }
        }).then( (response) => {
            console.log(response);
            console.log('status: ', response.data.status);
			console.log('Logged in user: ', response.data);
			this.loggedInUser = response.data.loggedInUser;
            this.loggedIn = true;
			this.showLogin = false;
			this.errorMsg = '';
        }, (error) => {
            console.log(error);
            this.loginErr = true;
            this.errorMsg = "login failed";
        })
    }

    this.logOut = () => {
        $http({
            method: 'DELETE',
            url: '/sessions'
        }).then( (response) => {
            console.log(response);
            this.loggedInUser = ''
            this.loggedIn = false;
            this.getAllThreads();
        }, (err) => {
            console.log(err.message);
        })
    }

}]);
