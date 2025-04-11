export const MENUITEMS = [

    // {
    //     menutitle: "MAIN",
    // },

    { path: `${import.meta.env.BASE_URL}dashboard`, title: "Dashboard", icon: 'fe-home', type: "link", active: false, selected: false, dirchange: false },

    // {
    //     menutitle: "User",
    // },

    {
        title: "User", icon: 'fe-user', type: "sub", menusub: true, active: false, selected: false, dirchange: false, children: [

            { path: `${import.meta.env.BASE_URL}dashboard/users`, type: "link", active: false, selected: false, dirchange: false, title: "User" },
            { path: `${import.meta.env.BASE_URL}dashboard/user/add`, type: "link", active: false, selected: false, dirchange: false, title: "Add User" },
        ]
    },

    // {
    //     menutitle: "Status",
    // },

    {
        title: "Status", icon: 'fe-package', type: "sub", menusub: true, active: false, selected: false, dirchange: false, children: [

            { path: `${import.meta.env.BASE_URL}dashboard/status`, type: "link", active: false, selected: false, dirchange: false, title: "Status" },
            { path: `${import.meta.env.BASE_URL}dashboard/status/add`, type: "link", active: false, selected: false, dirchange: false, title: "Add Status" },
        ]
    },

    // {
    //     menutitle: "Category",
    // },

    {
        title: "Category", icon: 'fe-package', type: "sub", menusub: true, active: false, selected: false, dirchange: false, children: [

            { path: `${import.meta.env.BASE_URL}dashboard/category`, type: "link", active: false, selected: false, dirchange: false, title: "Category" },
            { path: `${import.meta.env.BASE_URL}dashboard/category/add`, type: "link", active: false, selected: false, dirchange: false, title: "Add Category" },
        ]
    },

    // {
    //     menutitle: "Exam",
    // },

    {
        title: "Exam", icon: 'fe-file', type: "sub", menusub: true, active: false, selected: false, dirchange: false, children: [

            { path: `${import.meta.env.BASE_URL}dashboard/exam`, type: "link", active: false, selected: false, dirchange: false, title: "Exam" },
            { path: `${import.meta.env.BASE_URL}dashboard/exam/add`, type: "link", active: false, selected: false, dirchange: false, title: "Add Exam" },
        ]
    },

    // {
    //     menutitle: "Course",
    // },

    {
        title: "Course", icon: 'fe-file', type: "sub", menusub: true, active: false, selected: false, dirchange: false, children: [

            { path: `${import.meta.env.BASE_URL}dashboard/course`, type: "link", active: false, selected: false, dirchange: false, title: "Course" },
            { path: `${import.meta.env.BASE_URL}dashboard/course/add`, type: "link", active: false, selected: false, dirchange: false, title: "Add Course" },
        ]
    },
];

export const SUPERADMINMENUITEMS = [
    // {
    //     menutitle: "MAIN",
    // },

    { path: `${import.meta.env.BASE_URL}dashboard`, title: "Dashboard", icon: 'fe-home', type: "link", active: false, selected: false, dirchange: false },

    // {
    //     menutitle: "User",
    // },

    {
        title: "User", icon: 'fe-user', type: "sub", menusub: true, active: false, selected: false, dirchange: false, children: [

            { path: `${import.meta.env.BASE_URL}dashboard/users`, type: "link", active: false, selected: false, dirchange: false, title: "User" },
            { path: `${import.meta.env.BASE_URL}dashboard/user/add`, type: "link", active: false, selected: false, dirchange: false, title: "Add User" },
            // { path: `${import.meta.env.BASE_URL}dashboard/users`, type: "link", active: false, selected: false, dirchange: false, title: "User" },
            // { path: `${import.meta.env.BASE_URL}dashboard/admin`, type: "link", active: false, selected: false, dirchange: false, title: "Admin" },
            // { path: `${import.meta.env.BASE_URL}dashboard/editor`, type: "link", active: false, selected: false, dirchange: false, title: "Editor" },
            // { path: `${import.meta.env.BASE_URL}dashboard/property-manager`, type: "link", active: false, selected: false, dirchange: false, title: "Property Manager" },
            // { path: `${import.meta.env.BASE_URL}dashboard/counselor`, type: "link", active: false, selected: false, dirchange: false, title: "Counselor" },
            // { path: `${import.meta.env.BASE_URL}dashboard/cyber-partner`, type: "link", active: false, selected: false, dirchange: false, title: "Cyber Partner" },
            // { path: `${import.meta.env.BASE_URL}dashboard/agent`, type: "link", active: false, selected: false, dirchange: false, title: "Agent" },
            // { path: `${import.meta.env.BASE_URL}dashboard/student`, type: "link", active: false, selected: false, dirchange: false, title: "Student" },
            // { path: `${import.meta.env.BASE_URL}dashboard/user/add`, type: "link", active: false, selected: false, dirchange: false, title: "Add User" },
        ]
    },

    // {
    //     menutitle: "Status",
    // },

    {
        title: "Status", icon: 'fe-package', type: "sub", menusub: true, active: false, selected: false, dirchange: false, children: [

            { path: `${import.meta.env.BASE_URL}dashboard/status`, type: "link", active: false, selected: false, dirchange: false, title: "Status" },
            { path: `${import.meta.env.BASE_URL}dashboard/status/add`, type: "link", active: false, selected: false, dirchange: false, title: "Add Status" },
        ]
    },

    // {
    //     menutitle: "Category",
    // },

    {
        title: "Category", icon: 'fe-package', type: "sub", menusub: true, active: false, selected: false, dirchange: false, children: [

            { path: `${import.meta.env.BASE_URL}dashboard/category`, type: "link", active: false, selected: false, dirchange: false, title: "Category" },
            { path: `${import.meta.env.BASE_URL}dashboard/category/add`, type: "link", active: false, selected: false, dirchange: false, title: "Add Category" },
        ]
    },

    // {
    //     menutitle: "Exam",
    // },

    {
        title: "Exam", icon: 'fe-file', type: "sub", menusub: true, active: false, selected: false, dirchange: false, children: [

            { path: `${import.meta.env.BASE_URL}dashboard/exam`, type: "link", active: false, selected: false, dirchange: false, title: "Exam" },
            { path: `${import.meta.env.BASE_URL}dashboard/exam/add`, type: "link", active: false, selected: false, dirchange: false, title: "Add Exam" },
        ]
    },

    // {
    //     menutitle: "Course",
    // },

    {
        title: "Course", icon: 'fe-file', type: "sub", menusub: true, active: false, selected: false, dirchange: false, children: [

            { path: `${import.meta.env.BASE_URL}dashboard/course`, type: "link", active: false, selected: false, dirchange: false, title: "Course" },
            { path: `${import.meta.env.BASE_URL}dashboard/course/add`, type: "link", active: false, selected: false, dirchange: false, title: "Add Course" },
        ]
    },

    // {
    //     menutitle: "Property",
    // },

    {
        title: "Property", icon: 'fe-home', type: "sub", menusub: true, active: false, selected: false, dirchange: false, children: [

            { path: `${import.meta.env.BASE_URL}dashboard/property`, type: "link", active: false, selected: false, dirchange: false, title: "Property" },
            { path: `${import.meta.env.BASE_URL}dashboard/property/add`, type: "link", active: false, selected: false, dirchange: false, title: "Add Property" },
        ]
    },
];

export const ADMINMENUITEMS = [
    // {
    //     menutitle: "MAIN",
    // },

    { path: `${import.meta.env.BASE_URL}dashboard`, title: "Dashboard", icon: 'fe-home', type: "link", active: false, selected: false, dirchange: false },

    // {
    //     menutitle: "User",
    // },

    {
        title: "User", icon: 'fe-user', type: "sub", menusub: true, active: false, selected: false, dirchange: false, children: [

            { path: `${import.meta.env.BASE_URL}dashboard/users`, type: "link", active: false, selected: false, dirchange: false, title: "User" },
            { path: `${import.meta.env.BASE_URL}dashboard/user/add`, type: "link", active: false, selected: false, dirchange: false, title: "Add User" },
        ]
    },

    // {
    //     menutitle: "Status",
    // },

    {
        title: "Status", icon: 'fe-package', type: "sub", menusub: true, active: false, selected: false, dirchange: false, children: [

            { path: `${import.meta.env.BASE_URL}dashboard/status`, type: "link", active: false, selected: false, dirchange: false, title: "Status" },
            { path: `${import.meta.env.BASE_URL}dashboard/status/add`, type: "link", active: false, selected: false, dirchange: false, title: "Add Status" },
        ]
    },

    // {
    //     menutitle: "Category",
    // },

    {
        title: "Category", icon: 'fe-package', type: "sub", menusub: true, active: false, selected: false, dirchange: false, children: [

            { path: `${import.meta.env.BASE_URL}dashboard/category`, type: "link", active: false, selected: false, dirchange: false, title: "Category" },
            { path: `${import.meta.env.BASE_URL}dashboard/category/add`, type: "link", active: false, selected: false, dirchange: false, title: "Add Category" },
        ]
    },

    // {
    //     menutitle: "Exam",
    // },

    {
        title: "Exam", icon: 'fe-file', type: "sub", menusub: true, active: false, selected: false, dirchange: false, children: [

            { path: `${import.meta.env.BASE_URL}dashboard/exam`, type: "link", active: false, selected: false, dirchange: false, title: "Exam" },
            { path: `${import.meta.env.BASE_URL}dashboard/exam/add`, type: "link", active: false, selected: false, dirchange: false, title: "Add Exam" },
        ]
    },

    // {
    //     menutitle: "Course",
    // },

    {
        title: "Course", icon: 'fe-file', type: "sub", menusub: true, active: false, selected: false, dirchange: false, children: [

            { path: `${import.meta.env.BASE_URL}dashboard/course`, type: "link", active: false, selected: false, dirchange: false, title: "Course" },
            { path: `${import.meta.env.BASE_URL}dashboard/course/add`, type: "link", active: false, selected: false, dirchange: false, title: "Add Course" },
        ]
    },

    // {
    //     menutitle: "Property",
    // },

    {
        title: "Property", icon: 'fe-home', type: "sub", menusub: true, active: false, selected: false, dirchange: false, children: [

            { path: `${import.meta.env.BASE_URL}dashboard/property`, type: "link", active: false, selected: false, dirchange: false, title: "Property" },
            { path: `${import.meta.env.BASE_URL}dashboard/property/add`, type: "link", active: false, selected: false, dirchange: false, title: "Add Property" },
        ]
    },
];

export const PROPERTYMANAGERMENUITEMS = [
    // {
    //     menutitle: "MAIN",
    // },

    { path: `${import.meta.env.BASE_URL}dashboard`, title: "Dashboard", icon: 'fe-home', type: "link", active: false, selected: false, dirchange: false },

    // {
    //     menutitle: "Property",
    // },

    {
        title: "Property", icon: 'fe-home', type: "sub", menusub: true, active: false, selected: false, dirchange: false, children: [

            { path: `${import.meta.env.BASE_URL}dashboard/property`, type: "link", active: false, selected: false, dirchange: false, title: "Property" },
            { path: `${import.meta.env.BASE_URL}dashboard/property/add`, type: "link", active: false, selected: false, dirchange: false, title: "Add Property" },
        ]
    },
];

export const EDITORMENUITEMS = [
    // {
    //     menutitle: "MAIN",
    // },

    { path: `${import.meta.env.BASE_URL}dashboard`, title: "Dashboard", icon: 'fe-home', type: "link", active: false, selected: false, dirchange: false },

    {
        menutitle: "Profile",
    },

    {
        title: "Status", icon: 'fe-package', type: "sub", menusub: true, active: false, selected: false, dirchange: false, children: [

            { path: `${import.meta.env.BASE_URL}dashboard/status`, type: "link", active: false, selected: false, dirchange: false, title: "Status" },
            { path: `${import.meta.env.BASE_URL}dashboard/status/add`, type: "link", active: false, selected: false, dirchange: false, title: "Add Status" },
        ]
    },

    // {
    //     menutitle: "Category",
    // },

    {
        title: "Category", icon: 'fe-package', type: "sub", menusub: true, active: false, selected: false, dirchange: false, children: [

            { path: `${import.meta.env.BASE_URL}dashboard/category`, type: "link", active: false, selected: false, dirchange: false, title: "Category" },
            { path: `${import.meta.env.BASE_URL}dashboard/category/add`, type: "link", active: false, selected: false, dirchange: false, title: "Add Category" },
        ]
    },

    // {
    //     menutitle: "Course",
    // },

    {
        title: "Course", icon: 'fe-file', type: "sub", menusub: true, active: false, selected: false, dirchange: false, children: [

            { path: `${import.meta.env.BASE_URL}dashboard/course`, type: "link", active: false, selected: false, dirchange: false, title: "Course" },
            { path: `${import.meta.env.BASE_URL}dashboard/course/add`, type: "link", active: false, selected: false, dirchange: false, title: "Add Course" },
        ]
    },

    // {
    //     menutitle: "Exam",
    // },

    {
        title: "Exam", icon: 'fe-file', type: "sub", menusub: true, active: false, selected: false, dirchange: false, children: [

            { path: `${import.meta.env.BASE_URL}dashboard/exam`, type: "link", active: false, selected: false, dirchange: false, title: "Exam" },
            { path: `${import.meta.env.BASE_URL}dashboard/exam/add`, type: "link", active: false, selected: false, dirchange: false, title: "Add Exam" },
        ]
    },

    // {
    //     menutitle: "Property",
    // },

    {
        title: "Property", icon: 'fe-home', type: "sub", menusub: true, active: false, selected: false, dirchange: false, children: [

            { path: `${import.meta.env.BASE_URL}dashboard/property`, type: "link", active: false, selected: false, dirchange: false, title: "Property" },
            { path: `${import.meta.env.BASE_URL}dashboard/property/add`, type: "link", active: false, selected: false, dirchange: false, title: "Add Property" },
        ]
    },
];

export const COUNSELORMENUITEMS = [
    // {
    //     menutitle: "MAIN",
    // },

    { path: `${import.meta.env.BASE_URL}dashboard`, title: "Dashboard", icon: 'fe-home', type: "link", active: false, selected: false, dirchange: false },

    {
        menutitle: "Profile",
    },

    // {
    //     title: "Profile", icon: 'fe-user', type: "sub", menusub: true, active: false, selected: false, dirchange: false, children: [

    //         { path: `${import.meta.env.BASE_URL}dashboard/profile`, type: "link", active: false, selected: false, dirchange: false, title: "Porfile" },
    //         { path: `${import.meta.env.BASE_URL}dashboard/edit-profile`, type: "link", active: false, selected: false, dirchange: false, title: "Edit Profile" },
    //     ]
    // },
];

export const CYBERPARTNERMENUITEMS = [
    // {
    //     menutitle: "MAIN",
    // },

    { path: `${import.meta.env.BASE_URL}dashboard`, title: "Dashboard", icon: 'fe-home', type: "link", active: false, selected: false, dirchange: false },

    {
        menutitle: "Profile",
    },

    // {
    //     title: "Profile", icon: 'fe-user', type: "sub", menusub: true, active: false, selected: false, dirchange: false, children: [

    //         { path: `${import.meta.env.BASE_URL}dashboard/profile`, type: "link", active: false, selected: false, dirchange: false, title: "Porfile" },
    //         { path: `${import.meta.env.BASE_URL}dashboard/edit-profile`, type: "link", active: false, selected: false, dirchange: false, title: "Edit Profile" },
    //     ]
    // },
];

export const AGENTMENUITEMS = [
    // {
    //     menutitle: "MAIN",
    // },

    { path: `${import.meta.env.BASE_URL}dashboard`, title: "Dashboard", icon: 'fe-home', type: "link", active: false, selected: false, dirchange: false },

    {
        menutitle: "Profile",
    },

    // {
    //     title: "Profile", icon: 'fe-user', type: "sub", menusub: true, active: false, selected: false, dirchange: false, children: [

    //         { path: `${import.meta.env.BASE_URL}dashboard/profile`, type: "link", active: false, selected: false, dirchange: false, title: "Porfile" },
    //         { path: `${import.meta.env.BASE_URL}dashboard/edit-profile`, type: "link", active: false, selected: false, dirchange: false, title: "Edit Profile" },
    //     ]
    // },
];

export const STUDENTMENUITEMS = [
    // {
    //     menutitle: "MAIN",
    // },

    { path: `${import.meta.env.BASE_URL}dashboard`, title: "Dashboard", icon: 'fe-home', type: "link", active: false, selected: false, dirchange: false },

    {
        menutitle: "Profile",
    },

    // {
    //     title: "Profile", icon: 'fe-user', type: "sub", menusub: true, active: false, selected: false, dirchange: false, children: [

    //         { path: `${import.meta.env.BASE_URL}dashboard/profile`, type: "link", active: false, selected: false, dirchange: false, title: "Porfile" },
    //         { path: `${import.meta.env.BASE_URL}dashboard/edit-profile`, type: "link", active: false, selected: false, dirchange: false, title: "Edit Profile" },
    //     ]
    // },
];