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
                        url: 'javascript:void(0);',
                        clickMethod:"jobList('INT1')"
                    },
                    {
                        name: 'JobLog',
                        url: 'job/jobLogList/:INT1'
                    },
                    {
                        name: 'Line',
                        url: 'line/lineDetail/:INT1'
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
                        url: 'job/jobList/:INT2'
                    },
                    {
                        name: 'JobLog',
                        url: 'job/jobLogList/:INT2'
                    },
                    {
                        name: 'Line',
                        url: 'line/lineDetail/:INT2'
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
                        url: 'job/jobList/:MIX1'
                    },
                    {
                        name: 'JobLog',
                        url: 'job/jobLogList/:MIX1'
                    },
                    {
                        name: 'Line',
                        url: 'line/lineDetail/:MIX1'
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
                        url: '/order/receipt/receiptList/:10'
                    },
                    {
                        name: 'DoneReceipt',
                        url: '/order/receipt/receiptList/:80'
                    }
                ],
                url: '#'

            },
            {
                name: 'Process',
                SubMenus: [
                    {
                        name: 'PendingOrder',
                        url: '/order/process/processOrderList/:10'
                    },
                    {
                        name: 'OrderLog',
                        url: '/order/process/processOrderLogList/:80'
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
                url: '/storage/storageList'

            },
            {
                name: 'Product',
                url: '/product/productList'

            },
            {
                name: 'Equipments',
                SubMenus: [
                    {
                        name: 'Line',
                        url: '/line/lineList'

                    },
                    {
                        name: 'Section',
                        url: '/section/sectionList'

                    },
                    {
                        name: 'Scale',
                        url: '/scale/scaleList'

                    },
                    {
                        name: 'Discharger',
                        url: '/discharger/dischargerList'

                    },
                    {
                        name: 'Filler',
                        url: '/filler/fillerList'

                    }
                ],
                url: '#'

            },
            {
                name: 'EventLog',
                url: '/eventLog/eventLogList'
            }

        ],
        url: '#'
    },
    {
        name: 'Language',
        SubMenus: [
            {
                name: 'English',
                keepPage: true,
                url: '/en'
            },
            {
                name: 'Chinese',
                keepPage: true,
                url: '/zh'
            }
        ],
        url: '#'
    }
];
module.exports = ConfigureMenus;