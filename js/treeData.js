/*
type： 1为 上游股东（人）
0 为 下游（公司）
*/
export const treeData =
{
  name: '小米科技有限责任公司',
  parents: [{
    'money': '143934.04',
    'name': '雷军',
    'scale': 77.80,
    'type': '1',
    'Holding': 0,
    // 'children': [],
  }, {
    'money': '18724.35',
    'parentMoney': 3000,
    'name': '黎万强',
    'scale': 10.12,
    'type': '1',
    'Holding': '',
    // 'children': [],

  }, {
    'money': '18623',
    'parentMoney': 3000,
    'name': '洪峰',
    'scale': 10.07,
    'type': '1',
    'Holding': '',
    'children': [],

  }, {
    'money': '3718.4963',
    'name': '刘德',
    'scale': 2.01,
    'type': '1',
    'Holding': '',
    'children': [],
  }],
  children: [{
    'money': '30000',
    'name': '重庆小米创业投资有限公司1',
    'scale': 100,
    'type': '0',
    'children': [{
      'scale': 100,
      'money': '30000',
      'name': '[注销]珠海小额贷款有限公司1-1',
      'type': '0',
      'Holding': 0,
      'children': [{
        'scale': 100,
        'money': '30000',
        'name': 'xxx小额贷款有限公司',
        'type': '0',
        'Holding': 0,
      }, ]
    }, {
      'scale': 100,
      'money': '30000',
      'name': '[注销]珠海小额贷款有限公司1-2',
      'type': '0',
      'Holding': 0,
    }, ],
    'Holding': 0,
  }, 
    {
    'money': '800',
    'name': '重庆小米创业投资有限公司2',
    'scale': 100,
    'type': '0',
    'Holding': 0,
    },
    {
    'money': '80000',
    'name': '重庆小米创业投资有限公司3',
    'scale': 100,
    'type': '0',
    'Holding': 0,
    'children': [{
      'scale': 100,
      'money': '30000',
      'Holding': 0,
      'name': '重庆小米创业投资有限公司1-1',
      'type': '0',
    }, ]
    },
    {
    'money': '1000',
    'name': '重庆小米创业投资有限公司4',
    'scale': 100,
    'type': '0',
    'Holding': 0,
    'children': [ {
      'scale': 20,
      'money': '1000',
      'name': 'Xx贷款有限公司1-1',
      'type': '0',
      'Holding': 0,
    }, {
      'scale': 80,
      'money': '30000',
      'name': 'XX小额贷款有限公司1-2',
      'type': '0',
      'Holding': 0,
    }]
  }],
}