from channels.generic.websocket import AsyncJsonWebsocketConsumer


class PollConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        public_id = self.scope["url_route"]["kwargs"]["public_id"]
        self.group_name = f"poll_{public_id}"
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def poll_update(self, event):
        await self.send_json(event["data"])
