export default class EventEmitter {
	private subscribers: { [key: string]: Function[] } = {};

	public on(eventName: string, callback: Function) {
		if (!this.subscribers[eventName]) {
			this.subscribers[eventName] = [];
		}
		this.subscribers[eventName].push(callback);
	}

	public emit(eventName: string, ...args: any[]) {
		const eventSubscribers = this.subscribers[eventName] || [];
		eventSubscribers.forEach((callback) => callback(...args));
	}
}

export const globalEmitter = new EventEmitter();