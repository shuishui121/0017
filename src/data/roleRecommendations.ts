import { RoleType, CostumeCategory, HeadpieceCategory } from '@/types';
import { costumes } from './costumes';
import { headpieces } from './headpieces';

export interface RoleRecommendation {
  costumeIds: string[];
  headpieceIds: string[];
}

export interface RoleMatchRule {
  costumeCategories: CostumeCategory[];
  headpieceCategories: HeadpieceCategory[];
  priorityCostumes?: string[];
  priorityHeadpieces?: string[];
}

export const ROLE_MATCH_RULES: Record<RoleType, RoleMatchRule> = {
  laosheng: {
    costumeCategories: ['mangpao', 'pei', 'zhezi', 'guanyi'],
    headpieceCategories: ['imperial', 'official', 'other'],
    priorityCostumes: ['mangpao_1', 'pei_2', 'guanyi_1', 'zhezi_4'],
    priorityHeadpieces: ['xiangdiao_1', 'samao_1', 'zhongjingguan_1'],
  },
  xiaosheng: {
    costumeCategories: ['zhezi', 'pei', 'mangpao'],
    headpieceCategories: ['other', 'official'],
    priorityCostumes: ['zhezi_6', 'pei_3', 'mangpao_6'],
    priorityHeadpieces: ['wenshengjin_1', 'xiangjin_1'],
  },
  dan: {
    costumeCategories: ['pei', 'zhezi', 'mangpao'],
    headpieceCategories: ['female'],
    priorityCostumes: ['pei_6', 'zhezi_1', 'mangpao_8'],
    priorityHeadpieces: ['fengguan_1', 'hudiekui_1'],
  },
  qingyi: {
    costumeCategories: ['pei', 'zhezi', 'mangpao'],
    headpieceCategories: ['female'],
    priorityCostumes: ['pei_2', 'pei_3', 'zhezi_3'],
    priorityHeadpieces: ['fengguan_1', 'qixingezi_1'],
  },
  huadan: {
    costumeCategories: ['zhezi', 'pei'],
    headpieceCategories: ['female'],
    priorityCostumes: ['zhezi_6', 'pei_6', 'zhezi_1'],
    priorityHeadpieces: ['hudiekui_1', 'qixingezi_1'],
  },
  wudan: {
    costumeCategories: ['kao', 'zhezi'],
    headpieceCategories: ['warrior', 'female'],
    priorityCostumes: ['kao_6', 'kao_3'],
    priorityHeadpieces: ['hudiekui_1', 'fengchikui_1'],
  },
  laodan: {
    costumeCategories: ['zhezi', 'pei'],
    headpieceCategories: ['female', 'other'],
    priorityCostumes: ['zhezi_4', 'zhezi_3', 'pei_4'],
    priorityHeadpieces: ['chunyangjin_1', 'zhongjingguan_1'],
  },
  hualian: {
    costumeCategories: ['mangpao', 'kao'],
    headpieceCategories: ['warrior', 'imperial', 'official'],
    priorityCostumes: ['mangpao_5', 'mangpao_2', 'kao_4'],
    priorityHeadpieces: ['zijinguan_1', 'fuzikui_1', 'fengchikui_1'],
  },
  chou: {
    costumeCategories: ['zhezi', 'guanyi'],
    headpieceCategories: ['other', 'official'],
    priorityCostumes: ['zhezi_6', 'zhezi_4', 'guanyi_5'],
    priorityHeadpieces: ['wenshengjin_1', 'zhongjingguan_1'],
  },
  wensheng: {
    costumeCategories: ['zhezi', 'pei'],
    headpieceCategories: ['other', 'official'],
    priorityCostumes: ['zhezi_6', 'pei_3', 'pei_6'],
    priorityHeadpieces: ['wenshengjin_1', 'xiangjin_1'],
  },
  wusheng: {
    costumeCategories: ['kao', 'mangpao', 'zhezi'],
    headpieceCategories: ['warrior'],
    priorityCostumes: ['kao_2', 'kao_1', 'mangpao_4'],
    priorityHeadpieces: ['zijinguan_1', 'fengchikui_1', 'daeezi_1', 'fuzikui_1'],
  },
  custom: {
    costumeCategories: ['mangpao', 'kao', 'pei', 'zhezi', 'guanyi'],
    headpieceCategories: ['imperial', 'official', 'warrior', 'female', 'other'],
  },
};

export function getRecommendationsForRole(
  roleType: RoleType,
  count: number = 4
): RoleRecommendation {
  const rule = ROLE_MATCH_RULES[roleType];

  let costumeIds: string[] = [];

  if (rule.priorityCostumes && rule.priorityCostumes.length > 0) {
    const validPriority = rule.priorityCostumes.filter(id =>
      costumes.some(c => c.id === id)
    );
    costumeIds = [...validPriority];
  }

  const categoryCostumes = costumes
    .filter(c => rule.costumeCategories.includes(c.category))
    .map(c => c.id);

  for (const id of categoryCostumes) {
    if (!costumeIds.includes(id)) {
      costumeIds.push(id);
    }
  }

  costumeIds = costumeIds.slice(0, Math.max(count, 3));

  let headpieceIds: string[] = [];

  if (rule.priorityHeadpieces && rule.priorityHeadpieces.length > 0) {
    const validPriority = rule.priorityHeadpieces.filter(id =>
      headpieces.some(h => h.id === id)
    );
    headpieceIds = [...validPriority];
  }

  const categoryHeadpieces = headpieces
    .filter(h => rule.headpieceCategories.includes(h.category))
    .map(h => h.id);

  for (const id of categoryHeadpieces) {
    if (!headpieceIds.includes(id)) {
      headpieceIds.push(id);
    }
  }

  headpieceIds = headpieceIds.slice(0, Math.max(count, 3));

  return {
    costumeIds,
    headpieceIds,
  };
}

export function generateSchemeCombinations(
  roleType: RoleType,
  schemesPerRole: number = 4
): Array<{ costumeId: string; headpieceId: string }[]> {
  const { costumeIds, headpieceIds } = getRecommendationsForRole(roleType, schemesPerRole);

  const combinations: Array<{ costumeId: string; headpieceId: string }[]> = [];

  const minLen = Math.min(costumeIds.length, headpieceIds.length, schemesPerRole);

  for (let i = 0; i < minLen; i++) {
    combinations.push([{
      costumeId: costumeIds[i], headpieceId: headpieceIds[i] }]);
  }

  if (costumeIds.length > minLen) {
    for (let i = minLen; i < costumeIds.length && combinations.length < schemesPerRole; i++) {
      combinations.push([{
        costumeId: costumeIds[i], headpieceId: headpieceIds[0] }]);
    }
  }

  if (headpieceIds.length > minLen && combinations.length < schemesPerRole) {
    for (let i = minLen; i < headpieceIds.length && combinations.length < schemesPerRole; i++) {
      combinations.push([{
        costumeId: costumeIds[0], headpieceId: headpieceIds[i] }]);
    }
  }

  while (combinations.length < schemesPerRole) {
    const ci = combinations.length % costumeIds.length;
    const hi = (combinations.length + 1) % headpieceIds.length;
    combinations.push([{
      costumeId: costumeIds[ci], headpieceId: headpieceIds[hi] }]);
  }

  return combinations;
}

export const PRESET_ROLES = [
  { id: 'preset_1', name: '刘备', roleType: 'laosheng' as RoleType, description: '蜀汉皇帝，仁德之君' },
  { id: 'preset_2', name: '关羽', roleType: 'hualian' as RoleType, description: '忠义千秋，武圣关公' },
  { id: 'preset_3', name: '诸葛亮', roleType: 'wensheng' as RoleType, description: '卧龙先生，蜀国丞相' },
  { id: 'preset_4', name: '赵云', roleType: 'wusheng' as RoleType, description: '常山赵子龙，五虎上将' },
  { id: 'preset_5', name: '曹操', roleType: 'laosheng' as RoleType, description: '魏武帝，挟天子以令诸侯' },
  { id: 'preset_6', name: '周瑜', roleType: 'xiaosheng' as RoleType, description: '东吴大都督，美周郎' },
  { id: 'preset_7', name: '孙尚香', roleType: 'wudan' as RoleType, description: '东吴郡主，巾帼英雄' },
  { id: 'preset_8', name: '貂蝉', roleType: 'qingyi' as RoleType, description: '四大美人，闭月羞花' },
  { id: 'preset_9', name: '杨贵妃', roleType: 'dan' as RoleType, description: '四大美人，霓裳羽衣' },
  { id: 'preset_10', name: '穆桂英', roleType: 'wudan' as RoleType, description: '杨门女将，巾帼英雄' },
  { id: 'preset_11', name: '佘太君', roleType: 'laodan' as RoleType, description: '杨门女将统帅' },
  { id: 'preset_12', name: '蒋干', roleType: 'chou' as RoleType, description: '曹操谋士，盗书蒋干' },
  { id: 'preset_13', name: '包拯', roleType: 'hualian' as RoleType, description: '包青天，铁面无私' },
  { id: 'preset_14', name: '秦香莲', roleType: 'qingyi' as RoleType, description: '陈世美之妻，苦命妇人' },
  { id: 'preset_15', name: '展昭', roleType: 'wusheng' as RoleType, description: '南侠展昭，御猫' },
];
