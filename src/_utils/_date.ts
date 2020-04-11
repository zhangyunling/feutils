// 关于Date的快捷操作
import { numberPatchZero as _tf } from './_number';
import { isDate, isNumber, isString } from '../boolean/type';
import { TrimSecsTypes, DefaultStringTypes } from '../../types/index';

// 把传入的对象，转换为一个有效的时间对象，并返回该时间对象
// 如果无法正常解析成date对象，则直接抛错；
export function toDate (date: any): Date {
  let _str: string = '';
  let _date: any = null;

  // 如果没有传入值，则直接返回当前时间；
  if (!date) {
    return new Date();
  }

  // 如果是日期对象
  if (isDate(date)) {
    return date;
  } else if (isNumber(date)) {
    // 如果是传入的是数字，判断是否为合法的数字；
    _str = date.toString(10);

    if (_str.length === 13) {
      // 毫秒
      return new Date(date);
    } else if (_str.length === 10) {
      // 秒
      return new Date(date * 1000);
    }

    throw new Error('toDate转换为时间对象时出错，请检查您的输入，date=' + date);
  } else if (isString(date)) {
    // 如果是字符串，判断是否为合法的类似于时间的字符串；
    _date = date.replace(/[^\d\s:]+/g, '/');
  }

  _date = new Date(_date);

  if (isNaN(_date.getDate())) {
    throw new Error('toDate转换为时间对象时出错，请检查您的输入，date=' + date);
  }

  return _date;
}

// 根据毫秒数，转换成一个对象，目前只想到用于倒计时
export function trimCountDownSecs (secs: number): TrimSecsTypes {
  const arr: Array<string> = [];
  let _secs: number = Math.floor(secs / 1000);
  const data: TrimSecsTypes = {
    // 剩余毫秒数
    msecs: secs,
    // 剩余秒数
    secs: _secs,
    // 剩余分钟
    min: Math.floor(_secs / 60),
    // 剩余小时
    hour: Math.floor(_secs / 3600),
    // 剩余天数
    day: Math.floor(_secs / (3600 * 24)),
    // 剩余天数数据
    arr: arr
  };

  // 天
  arr.push(_tf(data.day));

  // 小时
  _secs = _secs % (3600 * 24);
  arr.push(_tf(Math.floor(_secs / 3600)));

  // 分
  _secs = _secs % 3600;
  arr.push(_tf(Math.floor(_secs / 60)));

  // 秒
  arr.push(_tf(Math.floor(_secs % 60)));

  return data;
}

// 定义一些私有变量，用于定义计算农历，以及一些节日的概念
// 用于判断，农历的年份，月份，闰月等相关信息的一个配置数组
export const tInfo: Array<any> = [
  0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2, 0x04ae0, 0x0a5b6,
  0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977, 0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970,
  0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950, 0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2,
  0x0a950, 0x0b557, 0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5b0, 0x14573, 0x052b0, 0x0a9a8, 0x0e950, 0x06aa0, 0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260,
  0x0f263, 0x0d950, 0x05b57, 0x056a0, 0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b6a0, 0x195a6, 0x095b0, 0x049b0, 0x0a974, 0x0a4b0,
  0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570, 0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x055c0, 0x0ab60, 0x096d5, 0x092e0, 0x0c960, 0x0d954,
  0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5, 0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930,
  0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530, 0x05aa0, 0x076a3, 0x096d0, 0x04bd7, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250,
  0x0d520, 0x0dd45, 0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0, 0x14b63];

// 公历每月的天数
// const solarMonth = [31,28,31,30,31,30,31,31,30,31,30,31];
// 节气
export const solarTerm: Array<string> = ['小寒', '大寒', '立春', '雨水', '惊蛰', '春分', '清明', '谷雨', '立夏', '小满', '芒种', '夏至', '小暑', '大暑', '立秋', '处暑', '白露', '秋分', '寒露', '霜降', '立冬', '小雪', '大雪', '冬至'];
//
export const sTermInfo: Array<number> = [0, 21208, 42467, 63836, 85337, 107014, 128867, 150921, 173149, 195551, 218072, 240693, 263343, 285989, 308563, 331033, 353350, 375494, 397447, 419210, 440795, 462224, 483532, 504758];

// 国历节日 *表示放假日
export const sFtv: DefaultStringTypes = {
  '0101': '元旦',
  '0106': '中国第13亿人口日',
  '0108': '周恩来逝世纪念日',
  '0115': '释迦如来成道日',
  '0121': '列宁逝世纪念日 国际声援南非日 弥勒佛诞辰',
  '0202': '世界湿地日',
  '0207': '二七大罢工纪念日',
  '0210': '国际气象节',
  '0214': '情人节',
  '0215': '中国12亿人口日',
  '0219': '邓小平逝世纪念日',
  '0221': '国际母语日 反对殖民制度斗争日',
  '0222': '苗族芦笙节',
  '0224': '第三世界青年日',
  '0228': '世界居住条件调查日',
  '0301': '国际海豹日',
  '0303': '全国爱耳日',
  '0305': '学雷锋纪念日 中国青年志愿者服务日',
  '0308': '妇女节',
  '0309': '保护母亲河日',
  '0311': '国际尊严尊敬日',
  '0312': '植树节',
  '0314': '国际警察日 白色情人节',
  '0315': '消费者权益日',
  '0316': '手拉手情系贫困小伙伴全国统一行动日',
  '0317': '中国国医节 国际航海日  爱尔兰圣帕特里克节',
  '0318': '全国科技人才活动日',
  '0321': '世界森林日 消除种族歧视国际日 世界儿歌日 世界睡眠日',
  '0322': '世界水日',
  '0323': '世界气象日',
  '0324': '世界防治结核病日',
  '0325': '全国中小学生安全教育日',
  '0329': '中国黄花岗七十二烈士殉难纪念',
  '0330': '巴勒斯坦国土日',
  '0401': '愚人节',
  '0402': '国际儿童图书日',
  '0407': '世界卫生日',
  '0411': '世界帕金森病日',
  '0421': '全国企业家活动日',
  '0422': '世界地球日 世界法律日',
  '0423': '世界图书和版权日',
  '0424': '亚非新闻工作者日 世界青年反对殖民主义日',
  '0425': '全国预防接种宣传日',
  '0426': '世界知识产权日',
  '0430': '世界交通安全反思日',
  '0501': '国际劳动节',
  '0503': '世界哮喘日 世界新闻自由日',
  '0504': '青年节',
  '0505': '碘缺乏病防治日 日本男孩节',
  '0508': '世界红十字日',
  '0512': '国际护士节',
  '0515': '国际家庭日',
  '0517': '国际电信日',
  '0518': '国际博物馆日',
  '0520': '全国学生营养日 全国母乳喂养宣传日',
  '0523': '国际牛奶日',
  '0526': '世界向人体条件挑战日',
  '0530': '中国“五卅”运动纪念日',
  '0531': '世界无烟日 英国银行休假日',
  '0601': '国际儿童节',
  '0605': '世界环境保护日',
  '0614': '世界献血者日',
  '0617': '防治荒漠化和干旱日',
  '0620': '世界难民日',
  '0622': '中国儿童慈善活动日',
  '0623': '国际奥林匹克日',
  '0625': '全国土地日',
  '0626': '国际禁毒日 国际宪章日 禁止药物滥用和非法贩运国际日 支援酷刑受害者国际日',
  '0630': '世界青年联欢节',
  '0701': '建党节',
  '0702': '国际体育记者日',
  '0706': '朱德逝世纪念日',
  '0707': '抗日战争纪念日',
  '0711': '世界人口日 中国航海日',
  '0726': '世界语创立日',
  '0728': '第一次世界大战爆发',
  '0730': '非洲妇女日',
  '0801': '建军节',
  '0805': '恩格斯逝世纪念日',
  '0806': '国际电影节',
  '0808': '中国男子节(爸爸节)',
  '0812': '国际青年节',
  '0813': '国际左撇子日',
  '0815': '抗日战争胜利纪念',
  '0826': '全国律师咨询日',
  '0902': '日本签署无条件投降书日',
  '0903': '中国抗日战争胜利纪念日',
  '0905': '瑞士萨永中世纪节',
  '0906': '帕瓦罗蒂去世',
  '0908': '国际扫盲日 国际新闻工作者日',
  '0909': '毛泽东逝世纪念日',
  '0910': '教师节',
  '0914': '世界清洁地球日',
  '0916': '国际臭氧层保护日 中国脑健康日',
  '0918': '九·一八事变纪念日',
  '0920': '国际爱牙日',
  '0921': '世界停火日 预防世界老年性痴呆宣传日',
  '0927': '世界旅游日',
  '0928': '孔子诞辰',
  '0930': '国际翻译日',
  '1001': '国庆节',
  '1002': '国庆节假日 国际和平与民主自由斗争日',
  '1003': '国庆节假日',
  '1004': '世界动物日',
  '1005': '国际教师节',
  '1006': '中国老年节',
  '1008': '全国高血压日 世界视觉日',
  '1009': '世界邮政日 万国邮联日',
  '1010': '辛亥革命纪念日 世界精神卫生日 世界居室卫生日',
  '1013': '世界保健日 国际教师节 中国少年先锋队诞辰日 世界保健日',
  '1014': '世界标准日',
  '1015': '国际盲人节(白手杖节)',
  '1016': '世界粮食日',
  '1017': '世界消除贫困日',
  '1020': '世界骨质疏松日',
  '1022': '世界传统医药日',
  '1024': '联合国日 世界发展新闻日',
  '1028': '中国男性健康日',
  '1031': '万圣节',
  '1102': '达摩祖师圣诞',
  '1106': '柴科夫斯基逝世悼念日',
  '1107': '十月社会主义革命纪念日',
  '1108': '中国记者日',
  '1109': '全国消防安全宣传教育日',
  '1110': '世界青年节',
  '1111': '光棍节',
  '1112': '孙中山诞辰纪念日',
  '1114': '世界糖尿病日',
  '1115': '泰国大象节',
  '1117': '国际大学生节 世界学生节 世界戒烟日',
  '1120': '世界儿童日',
  '1121': '世界问候日 世界电视日',
  '1129': '国际声援巴勒斯坦人民国际日',
  '1201': '世界艾滋病日',
  '1202': '废除一切形式奴役世界日',
  '1203': '世界残疾人日',
  '1204': '全国法制宣传日',
  '1205': '国际经济和社会发展志愿人员日 世界弱能人士日',
  '1207': '国际民航日',
  '1208': '国际儿童电视日',
  '1209': '世界足球日 一二·九运动纪念日',
  '1210': '世界人权日',
  '1211': '世界防止哮喘日',
  '1212': '西安事变纪念日',
  '1213': '南京大屠杀纪念日',
  '1214': '国际儿童广播电视节',
  '1215': '世界强化免疫日',
  '1220': '澳门回归纪念',
  '1221': '国际篮球日',
  '1224': '平安夜',
  '1225': '圣诞节',
  '1226': '毛泽东诞辰纪念日',
  '1229': '国际生物多样性日'
};

// 农历的节日
export const lFtv: DefaultStringTypes = {
  '0101': '春节',
  '0115': '元宵节',
  '0505': '端午节',
  '0707': '七夕情人节',
  '0715': '中元节',
  '0815': '中秋节',
  '0909': '重阳节',
  '1208': '腊八节',
  '1223': '小年',
  '0100': '除夕'
};

// 某月的第几个周，的节日
export const wFtv: DefaultStringTypes = {
  '0150': '世界麻风日', // 一月的最后一个星期日（月倒数第一个星期日）
  '0351': '全国中小学生安全教育日',
  '0453': '秘书节',
  '0512': '国世界哮喘日',
  '0520': '母亲节',
  '0530': '全国助残日',
  '0532': '国际牛奶日',
  '0626': '中国文化遗产日',
  '0630': '父亲节',
  '0716': '国际合作节',
  '0730': '被奴役国家周',
  '0932': '国际和平日',
  '0936': '全民国防教育日',
  '0940': '国际聋人节 世界儿童日',
  '0950': '世界海事日 世界心脏病日',
  '1011': '国际住房日 世界建筑日 世界人居日',
  '1023': '国际减轻自然灾害日(减灾日)',
  '1024': '世界视觉日',
  '1144': '感恩节',
  '1220': '国际儿童电视广播日'
};
