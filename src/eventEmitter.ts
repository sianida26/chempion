type EventName = "commentBarHiding" | "commentBarShowing" | "itemStartDrag" | "itemStopDrag"

export default class EventEmitter {
	private subscribers: { [key in EventName]?: Function[] } = {};

	public on(eventName: EventName, callback: Function) {
		if (!this.subscribers[eventName]) {
			this.subscribers[eventName] = [];
		}
		this.subscribers[eventName]!.push(callback);
	}

	public off(eventName: EventName, callback: Function) {
		const eventSubscribers = this.subscribers[eventName] || [];
		const index = eventSubscribers.indexOf(callback);
		if (index !== -1) {
			eventSubscribers.splice(index, 1);
		}
	}

	public emit(eventName: EventName, ...args: any[]) {
		const eventSubscribers = this.subscribers[eventName] || [];
		eventSubscribers.forEach((callback) => callback(...args));
	}
}

export const globalEmitter = new EventEmitter();