/**
 * Created by pi on 7/22/16.
 */

var ConfigureMenus = [
    {
        name: 'Warehouse',
        SubMenus: [
            {
                name: 'Raw',
                url: '/warehouse/rawwarehouse'
            },
            {
                name: 'Dis1',
                url: '/warehouse/dispensary/:dis1'
            },
            {
                name: 'FP',
                url: '/warehouse/finishedProduct'
            },
            {
                name: 'Lots',
                url: '/warehouse/Lots'
            }
        ],
        url: '#'
    },
    {
        name: 'Intake',
        SubMenus: [
            {
                name: 'INT1',
                navigation : true,
                SubMenus: [
                    {
                        name: 'Jobs',
                        url: 'job/JobList/:INT1'
                    },
                    {
                        name: 'JobLog',
                        url: 'job/JobLogList/:INT1'
                    },
                    {
                        name: 'Line',
                        url: 'line/LineDetail/:INT1'
                    }
                ],
                url: '#'

            },
            {
                name: 'INT2',
                navigation : true,
                SubMenus: [
                    {
                        name: 'Jobs',
                        url: 'job/JobList/:INT2'
                    },
                    {
                        name: 'JobLog',
                        url: 'job/JobLogList/:INT2'
                    },
                    {
                        name: 'Line',
                        url: 'line/LineDetail/:INT2'
                    }
                ],
                url: '#'

            }
        ]
    },
    {
        name: 'Production',
        SubMenus: [
            {
                name: 'MIX1',
                navigation : true,
                SubMenus: [
                    {
                        name: 'Jobs',
                        url: 'job/JobList/:MIX1'
                    },
                    {
                        name: 'JobLog',
                        url: 'job/JobLogList/:MIX1'
                    },
                    {
                        name: 'Line',
                        url: 'line/LineDetail/:MIX1'
                    }
                ],
                url: '#'

            }
        ],
        url: '#'
    },
    {
        name: 'Order',
        SubMenus: [
            {
                name: 'Receipt',
                SubMenus: [
                    {
                        name: 'PendingReceipt',
                        url: '/warehouse/ReceiptList/:10'
                    },
                    {
                        name: 'DoneReceipt',
                        url: '/warehouse/ReceiptList/:80'
                    }
                ],
                url: '#'

            },
            {
                name: 'Process',
                SubMenus: [
                    {
                        name: 'PendingOrder',
                        url: '/Order/Process/ProcessOderList'
                    },
                    {
                        name: 'OrderLog',
                        url: '/Order/Process/ProcessOderLogList'
                    }
                ],
                url: '#'

            }
        ],
        url: '#'
    },
    {
        name: 'DataManagement',
        SubMenus: [
            {
                name: 'Storage',
                url: '/Storage/StorageList'

            },
            {
                name: 'Equipments',
                SubMenus: [
                    {
                        name: 'Line',
                        url: '/line/LineList'

                    }
                ],
                url: '#'

            },

        ],
        url: '#'
    },
    {
        name: 'Users',
        SubMenus: [],
        url: '#'
    },
    {
        name: 'Language',
        SubMenus: [
            {
                name: 'English',
                url: '/en'
            },
            {
                name: 'Chinese',
                url: '/zh'
            }
        ],
        url: '#'
    }
];
module.exports = ConfigureMenus;