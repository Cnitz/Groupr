define([
    './Module'
], function(module) {
    return module.controller('CloudView.Controllers.TreeTest', [
        '$scope',
        '$state',
        '$mdSidenav',
        function TreeTestController($scope, $state, $mdSidenav) {
            $scope.accounts = [{
                type: 'Google',
                username: 'john.doe123@googlemail.com',
                dirs: [{
                    name: 'Folder 1',
                    subfolders: [{
                        name: 'SubFolder 1',
                        subfolders: [{
                            name: 'SubSubFolder 1',
                            subfolders: []
                        }, {
                            name: 'SubSubFolder 2',
                            subfolders: [{
                                name: 'Subx3 Folder 1',
                                subfolders: [{
                                    name: 'Subx4 Folder 1',
                                    subfolders: []
                                }, {
                                    name: 'Subx4 Folder 2',
                                    subfolders: []
                                }, {
                                    name: 'Subx4 Folder 3',
                                    subfolders: []
                                }]
                            }]
                        }, {
                            name: 'SubSubFolder 3',
                            subfolders: [{
                                name: 'Subx3 Folder 1',
                                subfolders: [{
                                    name: 'Subx4 Folder 1',
                                    subfolders: []
                                }, {
                                    name: 'Subx4 Folder 2',
                                    subfolders: []
                                }, {
                                    name: 'Subx4 Folder 3',
                                    subfolders: []
                                }]
                            }]
                        }]
                    }]
                }, {
                    name: 'Folder 2',
                    subfolders: [{
                        name: 'SubFolder 1',
                        subfolders: [{
                            name: 'SubSubFolder 1',
                            subfolders: []
                        }, {
                            name: 'SubSubFolder 2',
                            subfolders: [{
                                name: 'Subx3 Folder 1',
                                subfolders: [{
                                    name: 'Subx4 Folder 1',
                                    subfolders: []
                                }, {
                                    name: 'Subx4 Folder 2',
                                    subfolders: []
                                }, {
                                    name: 'Subx4 Folder 3',
                                    subfolders: []
                                }]
                            }]
                        }, {
                            name: 'SubSubFolder 3',
                            subfolders: [{
                                name: 'Subx3 Folder 1',
                                subfolders: [{
                                    name: 'Subx4 Folder 1',
                                    subfolders: []
                                }, {
                                    name: 'Subx4 Folder 2',
                                    subfolders: []
                                }, {
                                    name: 'Subx4 Folder 3',
                                    subfolders: []
                                }]
                            }]
                        }]
                    }]
                }, {
                    name: 'Folder 3',
                    subfolders: [{
                        name: 'SubFolder 1',
                        subfolders: [{
                            name: 'SubSubFolder 1',
                            subfolders: []
                        }, {
                            name: 'SubSubFolder 2',
                            subfolders: [{
                                name: 'Subx3 Folder 1',
                                subfolders: [{
                                    name: 'Subx4 Folder 1',
                                    subfolders: []
                                }, {
                                    name: 'Subx4 Folder 2',
                                    subfolders: []
                                }, {
                                    name: 'Subx4 Folder 3',
                                    subfolders: []
                                }]
                            }]
                        }, {
                            name: 'SubSubFolder 3',
                            subfolders: [{
                                name: 'Subx3 Folder 1',
                                subfolders: [{
                                    name: 'Subx4 Folder 1',
                                    subfolders: []
                                }, {
                                    name: 'Subx4 Folder 2',
                                    subfolders: []
                                }, {
                                    name: 'Subx4 Folder 3',
                                    subfolders: []
                                }]
                            }]
                        }]
                    }]
                }]
            }, {
                type: 'Google',
                username: 'John.Doe@work.com',
                dirs: [{
                    name: 'Folder 1',
                    subfolders: [{
                        name: 'SubFolder 1',
                        subfolders: [{
                            name: 'SubSubFolder 1',
                            subfolders: []
                        }, {
                            name: 'SubSubFolder 2',
                            subfolders: [{
                                name: 'Subx3 Folder 1',
                                subfolders: [{
                                    name: 'Subx4 Folder 1',
                                    subfolders: []
                                }, {
                                    name: 'Subx4 Folder 2',
                                    subfolders: []
                                }, {
                                    name: 'Subx4 Folder 3',
                                    subfolders: []
                                }]
                            }]
                        }, {
                            name: 'SubSubFolder 3',
                            subfolders: [{
                                name: 'Subx3 Folder 1',
                                subfolders: [{
                                    name: 'Subx4 Folder 1',
                                    subfolders: []
                                }, {
                                    name: 'Subx4 Folder 2',
                                    subfolders: []
                                }, {
                                    name: 'Subx4 Folder 3',
                                    subfolders: []
                                }]
                            }]
                        }]
                    }]
                }, {
                    name: 'Folder 2',
                    subfolders: [{
                        name: 'SubFolder 1',
                        subfolders: [{
                            name: 'SubSubFolder 1',
                            subfolders: []
                        }, {
                            name: 'SubSubFolder 2',
                            subfolders: [{
                                name: 'Subx3 Folder 1',
                                subfolders: [{
                                    name: 'Subx4 Folder 1',
                                    subfolders: []
                                }, {
                                    name: 'Subx4 Folder 2',
                                    subfolders: []
                                }, {
                                    name: 'Subx4 Folder 3',
                                    subfolders: []
                                }]
                            }]
                        }, {
                            name: 'SubSubFolder 3',
                            subfolders: [{
                                name: 'Subx3 Folder 1',
                                subfolders: [{
                                    name: 'Subx4 Folder 1',
                                    subfolders: []
                                }, {
                                    name: 'Subx4 Folder 2',
                                    subfolders: []
                                }, {
                                    name: 'Subx4 Folder 3',
                                    subfolders: []
                                }]
                            }]
                        }]
                    }]
                }, {
                    name: 'Folder 3',
                    subfolders: [{
                        name: 'SubFolder 1',
                        subfolders: [{
                            name: 'SubSubFolder 1',
                            subfolders: []
                        }, {
                            name: 'SubSubFolder 2',
                            subfolders: [{
                                name: 'Subx3 Folder 1',
                                subfolders: [{
                                    name: 'Subx4 Folder 1',
                                    subfolders: []
                                }, {
                                    name: 'Subx4 Folder 2',
                                    subfolders: []
                                }, {
                                    name: 'Subx4 Folder 3',
                                    subfolders: []
                                }]
                            }]
                        }, {
                            name: 'SubSubFolder 3',
                            subfolders: [{
                                name: 'Subx3 Folder 1',
                                subfolders: [{
                                    name: 'Subx4 Folder 1',
                                    subfolders: []
                                }, {
                                    name: 'Subx4 Folder 2',
                                    subfolders: []
                                }, {
                                    name: 'Subx4 Folder 3',
                                    subfolders: []
                                }]
                            }]
                        }]
                    }]
                }]
            }, {
                type: 'Dropbox',
                username: 'john.doe123',
                dirs: [{
                    name: 'Folder 1',
                    subfolders: [{
                        name: 'SubFolder 1',
                        subfolders: [{
                            name: 'SubSubFolder 1',
                            subfolders: []
                        }, {
                            name: 'SubSubFolder 2',
                            subfolders: [{
                                name: 'Subx3 Folder 1',
                                subfolders: [{
                                    name: 'Subx4 Folder 1',
                                    subfolders: []
                                }, {
                                    name: 'Subx4 Folder 2',
                                    subfolders: []
                                }, {
                                    name: 'Subx4 Folder 3',
                                    subfolders: []
                                }]
                            }]
                        }, {
                            name: 'SubSubFolder 3',
                            subfolders: [{
                                name: 'Subx3 Folder 1',
                                subfolders: [{
                                    name: 'Subx4 Folder 1',
                                    subfolders: []
                                }, {
                                    name: 'Subx4 Folder 2',
                                    subfolders: []
                                }, {
                                    name: 'Subx4 Folder 3',
                                    subfolders: []
                                }]
                            }]
                        }]
                    }]
                }, {
                    name: 'Folder 2',
                    subfolders: [{
                        name: 'SubFolder 1',
                        subfolders: [{
                            name: 'SubSubFolder 1',
                            subfolders: []
                        }, {
                            name: 'SubSubFolder 2',
                            subfolders: [{
                                name: 'Subx3 Folder 1',
                                subfolders: [{
                                    name: 'Subx4 Folder 1',
                                    subfolders: []
                                }, {
                                    name: 'Subx4 Folder 2',
                                    subfolders: []
                                }, {
                                    name: 'Subx4 Folder 3',
                                    subfolders: []
                                }]
                            }]
                        }, {
                            name: 'SubSubFolder 3',
                            subfolders: [{
                                name: 'Subx3 Folder 1',
                                subfolders: [{
                                    name: 'Subx4 Folder 1',
                                    subfolders: []
                                }, {
                                    name: 'Subx4 Folder 2',
                                    subfolders: []
                                }, {
                                    name: 'Subx4 Folder 3',
                                    subfolders: []
                                }]
                            }]
                        }]
                    }]
                }, {
                    name: 'Folder 3',
                    subfolders: [{
                        name: 'SubFolder 1',
                        subfolders: [{
                            name: 'SubSubFolder 1',
                            subfolders: []
                        }, {
                            name: 'SubSubFolder 2',
                            subfolders: [{
                                name: 'Subx3 Folder 1',
                                subfolders: [{
                                    name: 'Subx4 Folder 1',
                                    subfolders: []
                                }, {
                                    name: 'Subx4 Folder 2',
                                    subfolders: []
                                }, {
                                    name: 'Subx4 Folder 3',
                                    subfolders: []
                                }]
                            }]
                        }, {
                            name: 'SubSubFolder 3',
                            subfolders: [{
                                name: 'Subx3 Folder 1',
                                subfolders: [{
                                    name: 'Subx4 Folder 1',
                                    subfolders: []
                                }, {
                                    name: 'Subx4 Folder 2',
                                    subfolders: []
                                }, {
                                    name: 'Subx4 Folder 3',
                                    subfolders: []
                                }]
                            }]
                        }]
                    }]
                }]
            }];
        }
    ]);
});
