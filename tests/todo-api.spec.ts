import { test, expect } from '@playwright/test';

test.describe('Todo APIのテスト', () => {
    const baseUrl = 'http://localhost:3000/api';

    test('Todoリストを取得できること', async ({ request }) => {
        const response = await request.get(`${baseUrl}/todos`);
        expect(response.ok()).toBeTruthy();

        const todos = await response.json();
        expect(Array.isArray(todos)).toBeTruthy();
    });

    test('新しいTodoを作成できること', async ({ request }) => {
        // テスト用のTodoデータ
        const newTodo = {
            title: `API経由のテストタスク ${Date.now()}`,
            completed: false,
            deadline: null
        };

        // POSTリクエストを送信
        const response = await request.post(`${baseUrl}/todos`, {
            data: newTodo
        });

        // レスポンスの検証
        expect(response.ok()).toBeTruthy();

        const createdTodo = await response.json();
        expect(createdTodo.title).toBe(newTodo.title);
        expect(createdTodo.completed).toBe(newTodo.completed);
        expect(createdTodo.id).toBeDefined();
    });

    test('Todoの完了状態を更新できること', async ({ request }) => {
        // 新しいTodoを作成
        const newTodo = {
            title: `更新用テストタスク ${Date.now()}`,
            completed: false
        };

        const createResponse = await request.post(`${baseUrl}/todos`, {
            data: newTodo
        });

        const createdTodo = await createResponse.json();
        const todoId = createdTodo.id;

        // 完了状態を更新
        const updateResponse = await request.patch(`${baseUrl}/todos/${todoId}`, {
            data: { completed: true }
        });

        expect(updateResponse.ok()).toBeTruthy();

        // 更新の確認
        const listResponse = await request.get(`${baseUrl}/todos`);
        const todos = await listResponse.json();
        const updatedTodo = todos.find(todo => todo.id === todoId);

        expect(updatedTodo).toBeDefined();
        expect(updatedTodo?.completed).toBe(true);
    });
}); 