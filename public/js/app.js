const app = angular.module('forumApp', []);

app.controller('ThreadController', ['$http','$scope', function($http, $scope){
    this.newThread = {};
    this.updateThread = {};
    this.threads = [];
    this.deleteIndex = '';
    this.loggedInUser = '';
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
    this.addComment = (thread) => { 
        thread.comments.push(this.newComment);
        this.updateThread(thread);
        this.newComment = '';

    }

    ////////////////////////////////
    //         User Auth
    ////////////////////////////////

    this.createUser = () => { 
        $http({
            method: 'POST',
            url: '/users',
            data: {
                username: this.newUsername,
                password: this.newPassword
            }
        }).then( (response) => { 
            console.log(response);
        }, (error) => { 
            console.log(error);
        });
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
            this.loggedInUser = response.data.loggedInUser;
        }, (error) => { 
            console.log(error);
        })
    }

    this.logOut = () => { 
        $http({
            method: 'DELETE',
            url: '/sessions'
        }).then( (response) => { 
            console.log(response);
            this.loggedInUser = ''
        }, (err) => { 
            console.log(err.message);
        })
    }

}]);