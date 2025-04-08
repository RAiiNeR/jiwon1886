const postList = [
    {
        "num" : 1,
        "title" : "제목1",
        "writer" : "테스형1",
        "bdate" : "2024-11-08",
        "state" : "처리중"
    },
    {
        "num" : 2,
        "title" : "제목2",
        "writer" : "테스형2",
        "bdate" : "2024-11-08",
        "state" : "처리중"
    },
    {
        "num" : 3,
        "title" : "제목3",
        "writer" : "테스형3",
        "bdate" : "2024-11-08",
        "state" : "처리중"
    },
    {
        "num" : 4,
        "title" : "제목4",
        "writer" : "테스형4",
        "bdate" : "2024-11-08",
        "state" : "처리중"
    },
    {
        "num" : 5,
        "title" : "제목5",
        "writer" : "테스형5",
        "bdate" : "2024-11-08",
        "state" : "처리중"
    },
    {
        "num" : 6,
        "title" : "제목6",
        "writer" : "테스형6",
        "bdate" : "2024-11-08",
        "state" : "처리중"
    },
    {
        "num" : 7,
        "title" : "제목7",
        "writer" : "테스형7",
        "bdate" : "2024-11-08",
        "state" : "처리중"
    },
    {
        "num" : 8,
        "title" : "제목8",
        "writer" : "테스형8",
        "bdate" : "2024-11-08",
        "state" : "처리중"
    },
    {
        "num" : 9,
        "title" : "제목9",
        "writer" : "테스형9",
        "bdate" : "2024-11-08",
        "state" : "처리중"
    },
    {
        "num" : 10,
        "title" : "제목10",
        "writer" : "테스형10",
        "bdate" : "2024-11-08",
        "state" : "처리중"
    },
    {
        "num" : 11,
        "title" : "제목11",
        "writer" : "테스형11",
        "bdate" : "2024-11-08",
        "state" : "처리중"
    },
];

const getPostByNo = num => {
    const array = postList.filter(x => x.num==num);
    if (array.length == 1) {
        return array[0];
    }
    return null;
}

export {
    postList,
    getPostByNo
};