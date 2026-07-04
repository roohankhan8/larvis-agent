<?php

use App\Ai\Agents\ConversationLabAgent;
use App\Models\User;
use Laravel\Ai\Models\Conversation;
use Laravel\Ai\Models\ConversationMessage;

test('the conversation lab page loads', function () {
    $this->get(route('conversation-lab'))
        ->assertSuccessful();
});

test('the conversation lab stores and continues conversation history', function () {
    config(['ai.conversations.generate_title' => false]);

    $user = User::factory()->create();
    $this->actingAs($user);

    ConversationLabAgent::fake([
        'I can remember the first answer and continue from there.',
        'Here is the follow-up answer that uses the same thread.',
    ])->preventStrayPrompts();

    $firstResponse = $this->postJson('/conversation-lab', [
        'message' => 'What is the point of this lab?',
    ])->assertSuccessful()
        ->assertJsonPath('status', 'success')
        ->assertJsonPath('data.reply', 'I can remember the first answer and continue from there.');

    $conversationId = $firstResponse->json('data.conversation_id');

    expect($conversationId)->toBeString();

    $conversation = Conversation::query()->whereKey($conversationId)->firstOrFail();

    expect($conversation->user_id)->toBe($user->id);

    expect(
        ConversationMessage::query()
            ->where('conversation_id', $conversationId)
            ->count(),
    )->toBe(2);

    $this->postJson('/conversation-lab', [
        'conversation_id' => $conversationId,
        'message' => 'Can you continue the same thread?',
    ])->assertSuccessful()
        ->assertJsonPath('data.conversation_id', $conversationId)
        ->assertJsonPath('data.reply', 'Here is the follow-up answer that uses the same thread.');

    expect(
        ConversationMessage::query()
            ->where('conversation_id', $conversationId)
            ->count(),
    )->toBe(4);

    ConversationLabAgent::assertPrompted('What is the point of this lab?');
    ConversationLabAgent::assertPrompted('Can you continue the same thread?');
});
