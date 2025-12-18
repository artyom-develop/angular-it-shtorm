export interface ModalRequest{
	name: string;
	phone: string;
	service?: string;
	type: ModalType
}

export enum ModalType {
	order = 'order',
	consultation = 'consultation',
}