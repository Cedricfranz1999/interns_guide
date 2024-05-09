"use client";

import { useRouter } from "next/navigation";

import React, { useState } from "react";
import type { FormProps } from "antd";
import { Button, Checkbox, Form, Input, InputNumber, Modal, Table } from "antd";
import { api } from "~/trpc/react";
import { useForm } from "antd/es/form/Form";

interface userType {
  id: number;
  firstname: string | null;
  lastname: string | null;
  address: string | null;
  age: number | null;
}

type FieldType = {
  firstname?: string;
  lastname?: string;
  address?: string;
  age?: number;
};

const UserTable = ({ userData }: { userData: userType[] }) => {
  const [form] = Form.useForm();
  const [buttonpress, setButtonPress] = useState<string | undefined>(undefined);
  const [userId, setUserId] = useState<number | undefined>(undefined);
  const columns = [
    {
      title: "FirstName",
      dataIndex: "firstname",
      key: "firstname",
    },
    {
      title: "Lastname",
      dataIndex: "lastname",
      key: "age",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
    },
    {
      title: "Action",
      key: "action",
      render: (_: userType, record: userType) => {
        return (
          <div className="flex gap-7">
            <button
              className=" rounded-sm bg-yellow-500  p-2  font-semibold text-white hover:bg-yellow-600"
              onClick={(e) => UpdateModal(record)}
            >
              Update
            </button>
            <button
              className=" rounded-sm bg-red-400  p-2  font-semibold text-white hover:bg-red-600 "
              onClick={(e) => handleDelete(record.id)}
            >
              Delete
            </button>
          </div>
        );
      },
    },
  ];
  const { data, refetch } = api.post.getUser.useQuery();

  const createUser = api.post.createUser.useMutation({
    onSuccess: async () => {
      try {
        window.alert("User Successfully Created");
        setIsModalOpen(false);
        form.resetFields();
        await refetch();
      } catch (error) {
        console.error("An error occurred:", error);
      }
    },
  });

  const deleteUser = api.post.deleteUser.useMutation({
    onSuccess: async () => {
      try {
        window.alert("User Successfully deleted");
        await refetch();
      } catch (error) {
        console.error("An error occurred:", error);
      }
    },
  });

  const updateUser = api.post.updateUser.useMutation({
    onSuccess: async () => {
      try {
        window.alert("User Successfully deleted");
        await refetch();
        setIsModalOpen(false);
        form.resetFields();
      } catch (error) {
        console.error("An error occurred:", error);
      }
    },
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const AddModal = () => {
    setIsModalOpen(true);
    setButtonPress("add");
  };

  const UpdateModal = (e: userType) => {
    setUserId(e.id);
    form.setFieldsValue({
      firstname: e.firstname,
      lastname: e.lastname,
      age: e.age,
      address: e.address,
    });
    setIsModalOpen(true);
    setButtonPress("update");
  };

  const handleCancel = async () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  console.log("====================================");
  console.log(buttonpress);
  console.log("====================================");

  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    const { firstname, lastname, address, age } = values;

    buttonpress === "create"
      ? createUser.mutate({
          firstname: firstname ?? "",
          lastname: lastname ?? "",
          address: address ?? "",
          age: age ?? 0,
        })
      : updateUser.mutate({
          id: userId ?? 0,
          firstname: firstname ?? "",
          lastname: lastname ?? "",
          address: address ?? "",
          age: age ?? 0,
        });
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo,
  ) => {
    console.log("Failed:", errorInfo);
  };

  const handleDelete = (e: number) => {
    console.log(e);
    deleteUser.mutate({
      id: e,
    });
  };

  return (
    <div className=" h-screen w-full pl-20">
      <div className="my-20  flex  w-3/4 justify-end   gap-5">
        <button
          onClick={AddModal}
          className=" rounded-sm bg-green-400  p-2  font-semibold text-white hover:bg-green-600 "
        >
          Add User
        </button>
      </div>
      <Modal footer={[]} open={isModalOpen} onCancel={handleCancel}>
        <Form
          form={form}
          style={{ maxWidth: 600, minHeight: 250, padding: 50 }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item<FieldType>
            label="Firstname"
            name="firstname"
            rules={[
              { required: true, message: "Please input your firstname!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item<FieldType>
            label="Lastname"
            name="lastname"
            rules={[{ required: true, message: "Please input your lastname!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label="UserAge"
            name="age"
            rules={[{ required: true, message: "Please input your age!" }]}
          >
            <InputNumber className="w-full" />
          </Form.Item>

          <Form.Item<FieldType>
            label="Address"
            name="address"
            rules={[{ required: true, message: "Please input your address!" }]}
          >
            <Input />
          </Form.Item>

          <button
            type="submit"
            className=" float-right rounded-sm  bg-green-400 p-2  font-semibold text-white hover:bg-green-600 "
          >
            Add User
          </button>
        </Form>
      </Modal>
      <Table dataSource={data} columns={columns} />
    </div>
  );
};

export default UserTable;
