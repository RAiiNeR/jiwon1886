﻿CREATE TABLE MANAGER(
NUM NUMBER PRIMARY KEY,
ID VARCHAR2(50),
NAME VARCHAR2(50),
ROLE VARCHAR2(50),
PWD VARCHAR2(200),
IMGNAME VARCHAR2(100),
JOINEDDATE DATE,
DEPTNO NUMBER,
CONSTRAINT MANAGER_DEPTNO_FK FOREIGN KEY(DEPTNO) REFERENCES DEPT(DEPTNO)
);

CREATE SEQUENCE MANAGER_SEQ
INCREMENT BY 1
START WITH 1;

SELECT * FROM MANAGER;

SELECT * FROM MANAGER WHERE ID = 'test';
