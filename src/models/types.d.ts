export type TypeAttachments = 'bill' | 'photo';
export type Attachment = null | undefined | { url: string; name: string };
export type Attachments = Partial<Record<TypeAttachments, Attachment>>;

interface GoodsOverCostBase {
  nameType: string;
  caracte: string;
  type: string;
  value: string;
  real_value: string;
  typeCode: number;
}

export interface GoodsOverCost extends GoodsOverCostBase {
  files: Attachments;
}

export type AttachmentLocal = { file: File; errorFile?: string | null };
export type AttachmentsLocal = Record<
  TypeAttachments,
  Attachment | AttachmentLocal
>;

export interface GoodsOverCostLocal extends GoodsOverCostBase {
  files?: AttachmentsLocal;
}

export type ItemRequired = boolean | ((total: RequiredParam) => boolean);

export interface Item {
  label: string;
  id: string | number;
  min: number;
  max: number;
  maxTotal: number;
  required?: ItemRequired;
}
