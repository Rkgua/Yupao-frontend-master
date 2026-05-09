import { UserType } from "./user";

/**
 * 队伍类别
 */
export type TeamType = {
  id: number; // 队伍ID
  userId: number;
  name: string;
  description: string;
  expireTime?: Date; // 过期时间
  maxNum: number; // 最大人数
  password?: string; // 队伍密码（加密队伍）
  status: number; // 队伍状态
  createTime: Date;
  updateTime: Date;
  createUser?: UserType; // 创建人信息
  hasJoinNum?: number; // 已加入人数
};
