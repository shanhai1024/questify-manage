export interface MenuItem {
    index: string
    title: string
    icon: string          // 对应 icons 目录下的 svg 名
    route?: string        // 叶子节点时使用
    children?: MenuItem[]
}

export const menuList: MenuItem[] = [
    { index: '/', title: '主页', icon: 'home', route: '/' },

    {
        index: '1',
        title: '系统管理',
        icon: 'settings',
        children: [
            { index: '1-1', title: '用户管理',   icon: 'user',   route: '/sys/user' },
            { index: '1-2', title: '角色管理',   icon: 'role',   route: '/sys/role' },
            { index: '1-3', title: '权限管理',   icon: 'shield', route: '/sys/perm' }
        ]
    },

    {
        index: '2',
        title: '题目管理',
        icon: 'paper',
        children: [
            {
                index: '2-1',
                title: '题目管理',
                icon: 'list',
                children: [
                    { index: '2-1-1', title: '单选题管理', icon: 'single', route: '/question/single' },
                    { index: '2-1-2', title: '多选题管理', icon: 'multi',  route: '/question/multi'  },
                    { index: '2-1-3', title: '判断题管理', icon: 'judge',  route: '/question/judge'  },
                    { index: '2-1-4', title: '解答题管理', icon: 'answer', route: '/question/answer' }
                ]
            },
            { index: '2-2', title: '分类管理', icon: 'category', route: '/question/category' },
            { index: '2-3', title: '标签管理', icon: 'tag',      route: '/question/tag' }
        ]
    },

    { index: '/setting', title: '系统设置', icon: 'setting', route: '/setting' }
]
