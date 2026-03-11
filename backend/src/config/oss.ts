import OSS from 'ali-oss';
import Setting from '../models/Setting';

// 根据用户配置创建 OSS 客户端
export const getOSSClientForUser = async (userId: string): Promise<OSS> => {
  const settings = await Setting.findOne({ userId });

  if (!settings) {
    throw new Error('未找到 OSS 配置，请先在设置页面配置 OSS 参数');
  }

  return new OSS({
    region: settings.ossRegion,
    accessKeyId: settings.ossAccessKeyId,
    accessKeySecret: settings.ossAccessKeySecret,
    bucket: settings.ossBucket,
  });
};

// 获取用户的 OSS 配置
export const getOSSSettingsForUser = async (userId: string) => {
  const settings = await Setting.findOne({ userId });

  if (!settings) {
    throw new Error('未找到 OSS 配置，请先在设置页面配置 OSS 参数');
  }

  return {
    region: settings.ossRegion,
    accessKeyId: settings.ossAccessKeyId,
    accessKeySecret: settings.ossAccessKeySecret,
    bucket: settings.ossBucket,
    domain: settings.ossDomain,
  };
};

// 旧的获取默认 OSS 客户端方法（向后兼容）
let client: OSS | null = null;

const getOSSClient = (): OSS => {
  if (!client) {
    client = new OSS({
      region: process.env.OSS_REGION,
      accessKeyId: process.env.OSS_ACCESS_KEY_ID as string,
      accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET as string,
      bucket: process.env.OSS_BUCKET,
    });
  }
  return client;
};

export default getOSSClient;

