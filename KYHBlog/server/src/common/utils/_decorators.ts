export function SendSocketMessage(event: string): MethodDecorator {
  return (target, propertyKey, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value

    descriptor.value = function (...args: any[]) {
      const result = originalMethod.apply(this, args)

      if (result && result.server && result.roomId && result.payload) {
        result.server.to(result.roomId).emit(event, result.payload)
      }
      return result
    }

    return descriptor
  }
}
