const app = angular.module('forumApp', []);

app.controller('ThreadController', ['$http', function($http){
    this.newThread = {};
    this.updateThread = {};
    this.threads = [];
    this.deleteIndex = '';
    this.loggedInUser = '';


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
            this.threads.push(response.data);
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
        },  (err) => { 
            console.log(err.message);
        });
    }
    this.editThreadLikes = (thread) => {
        thread.likes += 1;
        this.updateThread(thread);
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