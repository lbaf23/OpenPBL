import React, {useEffect, useState} from 'react';
import QueueAnim from 'rc-queue-anim';
import {Avatar, Button, Popconfirm, Table, message, Pagination, Tooltip} from "antd";
import {DeleteOutlined,ArrowRightOutlined} from "@ant-design/icons"

import ProjectApi from "../../../../api/ProjectApi";
import util from "../../component/Util"
import {Link} from "react-router-dom";

function StudentAdmin(obj) {
  const pid = obj.project.id
  const [students, setStudents] = useState([])

  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)

  useEffect(() => {
    updateStudentList()
  }, []);

  const updateStudentList = () => {
    ProjectApi.getProjectStudents(pid)
      .then((res) => {
        if (res.data.code === 200) {
          setStudents(res.data.students);
          setTotal(res.data.count)
        }
      })
      .catch(e=>{console.log(e)})
  }
  const removeStudent = (action, record) => {
    ProjectApi.removeStudent(record.projectId, record.studentId)
      .then(res=>{
        if (res.data.code === 200) {
          message.success(res.data.msg)
          updateStudentList()
        } else {
          message.error(res.data.msg)
        }
      })
      .catch(e=>{console.log(e)})
  }

  return (
    <QueueAnim>
      <div style={{textAlign: 'left'}} key="1">
        <Table
          dataSource={students}
          columns={[
              {
                title: '头像',
                dataIndex: 'avatar',
                key: 'avatar',
                render: avatar => (
                  <Avatar src={avatar} />
                )
              },
              {
                title: '学生',
                dataIndex: 'name',
                key: 'name'
              },
              {
                title: '加入时间',
                dataIndex: 'joinTime',
                key: 'joinTime',
                render: joinTime => (
                  <span>{util.FilterTime(joinTime)}</span>
                )
              },
              {
                title: '操作',
                dataIndex: 'action',
                key: 'action',
                render: (action, record) => (
                  <>
                    <Tooltip placement="topLeft" title="点击查看学习证据">
                      <Link to={`/project/${pid}/student/${record.studentId}/evidence`}>
                        <Button type="text" icon={<ArrowRightOutlined />} style={{marginRight: '30px', width: '50px'}}/>
                      </Link>
                    </Tooltip>
                    <Popconfirm title="确定移除学生？" onConfirm={e=>removeStudent(action, record)}>
                      <Button shape="circle" type="text" style={{color: 'red'}} icon={<DeleteOutlined/>}/>
                    </Popconfirm>
                  </>
                )
              },
            ]}
          pagination={false}
        />
        <Pagination
          total={total}
          showTotal={t => `共${total}名学生参加`}
          current={page}
          onChange={updateStudentList}
          onShowSizeChange={updateStudentList}
          style={{marginTop: '20px', textAlign: 'right'}}
        />
      </div>
    </QueueAnim>
  );
}

export default StudentAdmin;
