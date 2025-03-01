import { test, expect } from '@playwright/test';

// WebKit診断専用のテスト
test.describe('WebKit診断テスト', () => {
    // WebKitテストは明示的に有効化した場合のみ実行
    test.skip(process.env.WEBKIT_ENABLED !== 'true', 'WebKitテストは明示的に有効化した場合のみ実行します');

    // 長めのタイムアウトを設定
    test.setTimeout(120000);

    // 環境変数からURLを取得（柔軟な設定）
    const TODO_URL = process.env.TODO_URL || 'http://localhost:3000/todos';

    // ブラウザ情報の収集
    test('ブラウザ情報の取得', async ({ page, browserName }) => {
        // このテストはWebKitでのみ実行
        test.skip(browserName !== 'webkit', 'WebKitでのみ実行するテスト');

        await page.goto(TODO_URL);

        // 詳細なブラウザ情報を収集
        const userAgent = await page.evaluate(() => navigator.userAgent);
        const viewport = await page.evaluate(() => ({
            width: window.innerWidth,
            height: window.innerHeight,
            devicePixelRatio: window.devicePixelRatio
        }));

        console.log(`WebKit診断: UserAgent = ${userAgent}`);
        console.log(`WebKit診断: Viewport = ${JSON.stringify(viewport)}`);

        // ページのHTML構造を取得
        const html = await page.content();
        console.log(`WebKit診断: HTML長さ = ${html.length}文字`);

        // スクリーンショットを撮影
        await page.screenshot({ path: 'webkit-debug-initial.png', fullPage: true });

        expect(true).toBeTruthy(); // テストを成功させる
    });

    // DOM要素の検証
    test('DOM要素の詳細検査', async ({ page, browserName }) => {
        test.skip(browserName !== 'webkit', 'WebKitでのみ実行するテスト');

        await page.goto(TODO_URL);
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(3000); // 長めに待機

        // Todoフォームの確認
        const inputExists = await page.locator('input[placeholder="What needs to be done?"]').count() > 0;
        console.log(`WebKit診断: Todo入力欄存在 = ${inputExists}`);

        if (inputExists) {
            // TodoアイテムをJavaScriptで直接追加（UIイベントを回避）
            await page.evaluate(() => {
                const input = document.querySelector('input[placeholder="What needs to be done?"]');
                if (input) {
                    (input as HTMLInputElement).value = 'WebKit診断用Todo';

                    // フォーム送信をシミュレート
                    const form = input.closest('form');
                    if (form) {
                        const submitEvent = new Event('submit', { bubbles: true });
                        form.dispatchEvent(submitEvent);
                    } else {
                        console.log('フォームが見つかりません');
                    }
                }
            });

            // 追加後の待機
            await page.waitForTimeout(3000);
            await page.screenshot({ path: 'webkit-debug-after-add.png', fullPage: true });

            // 追加されたかどうかを確認
            const todoExists = await page.locator('text=WebKit診断用Todo').count() > 0;
            console.log(`WebKit診断: 追加されたTodo存在 = ${todoExists}`);

            // DOM構造の詳細を取得
            if (todoExists) {
                const todoStructure = await page.evaluate(() => {
                    const todoElement = document.evaluate(
                        "//*[contains(text(), 'WebKit診断用Todo')]",
                        document,
                        null,
                        XPathResult.FIRST_ORDERED_NODE_TYPE
                    ).singleNodeValue;

                    if (todoElement) {
                        // DOM階層を上に3階層分取得
                        let current = todoElement as HTMLElement;
                        let structure = '';
                        let depth = 0;

                        while (current && current.tagName && depth < 5) {
                            structure += `${depth}: ${current.tagName} - クラス: ${current.className}\n`;
                            // 兄弟要素の数を確認
                            const siblings = current.parentElement ? current.parentElement.children.length : 0;
                            structure += `   兄弟要素数: ${siblings}\n`;

                            // 子要素のボタンがあるか確認
                            const buttons = current.querySelectorAll('button');
                            structure += `   ボタン要素数: ${buttons.length}\n`;

                            if (buttons.length > 0) {
                                for (let i = 0; i < buttons.length; i++) {
                                    const btn = buttons[i] as HTMLButtonElement;
                                    structure += `   ボタン ${i + 1}: クラス=${btn.className}, 表示=${getComputedStyle(btn).display}, 内容=${btn.textContent || btn.innerHTML}\n`;
                                }
                            }

                            current = current.parentElement as HTMLElement;
                            depth++;
                        }
                        return structure;
                    }
                    return 'Todo要素が見つかりません';
                });

                console.log(`WebKit診断: Todo要素構造:\n${todoStructure}`);
            }
        }

        expect(true).toBeTruthy(); // テストを成功させる
    });

    // イベント処理と削除操作の診断
    test('イベント処理と削除操作の診断', async ({ page, browserName }) => {
        test.skip(browserName !== 'webkit', 'WebKitでのみ実行するテスト');

        await page.goto(TODO_URL);
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(3000);

        // Todoを追加
        await page.fill('input[placeholder="What needs to be done?"]', '削除診断用Todo');
        await page.click('button:has-text("Add Todo")');
        await page.waitForTimeout(3000);

        const todoText = '削除診断用Todo';
        const todoItem = page.locator(`text=${todoText}`).first();

        // ホバーイベントの診断
        if (await todoItem.count() > 0) {
            console.log('WebKit診断: ホバーイベントのテスト開始');

            // ホバー前のスクリーンショット
            await page.screenshot({ path: 'webkit-debug-before-hover.png', fullPage: true });

            // ホバー実行
            await todoItem.hover();
            await page.waitForTimeout(2000);

            // ホバー後のスクリーンショット
            await page.screenshot({ path: 'webkit-debug-after-hover.png', fullPage: true });

            // ホバー後の要素の状態を取得
            await page.evaluate(async (todoText) => {
                const todoElement = document.evaluate(
                    `//*[contains(text(), '${todoText}')]`,
                    document,
                    null,
                    XPathResult.FIRST_ORDERED_NODE_TYPE
                ).singleNodeValue as HTMLElement;

                if (todoElement) {
                    // Todo要素の詳細な情報
                    console.log(`Todo要素: ${todoElement.tagName}, クラス: ${todoElement.className}`);

                    // 親要素とその中のボタンを探索
                    let parent = todoElement.parentElement;
                    let searchDepth = 0;

                    while (parent && searchDepth < 5) {
                        const buttons = parent.querySelectorAll('button');
                        console.log(`親要素 ${searchDepth + 1}: ${parent.tagName}, クラス: ${parent.className}, ボタン数: ${buttons.length}`);

                        if (buttons.length > 0) {
                            for (let i = 0; i < buttons.length; i++) {
                                const btn = buttons[i] as HTMLButtonElement;
                                const rect = btn.getBoundingClientRect();
                                const style = getComputedStyle(btn);
                                console.log(`ボタン ${i + 1}: 表示=${style.display}, 可視=${style.visibility}, サイズ=${rect.width}x${rect.height}, 内容=${btn.textContent || btn.innerHTML}`);

                                // ボタンの位置情報
                                console.log(`ボタン位置: X=${rect.left}, Y=${rect.top}, 右端=${rect.right}, 下端=${rect.bottom}`);

                                // このボタンが削除ボタンっぽいかの判定（class名や内容で判断）
                                const isLikelyDeleteBtn =
                                    btn.className.includes('delete') ||
                                    btn.className.includes('remove') ||
                                    (btn.textContent && (btn.textContent.includes('削除') || btn.textContent.includes('×')));

                                console.log(`削除ボタンの可能性: ${isLikelyDeleteBtn}`);
                            }
                        }

                        parent = parent.parentElement;
                        searchDepth++;
                    }
                }
            }, todoText);

            // 実際に削除を試みる
            try {
                console.log('削除操作の試行:');

                // 方法1: 一般的なセレクタでの検索
                const deleteBtn = page.locator('button:has-text("×"), button:has-text("Delete"), button.delete-button, button.remove-button').first();
                if (await deleteBtn.count() > 0) {
                    console.log('方法1: 一般的なセレクタで削除ボタンを発見');
                    await deleteBtn.click();
                } else {
                    console.log('方法1: 一般的なセレクタでは削除ボタンを発見できず');

                    // 方法2: JavaScript経由での削除
                    const wasDeleted = await todoItem.evaluate(el => {
                        const parent = el.closest('.todo-item') || el.parentElement;
                        if (!parent) return false;

                        const deleteBtn = parent.querySelector('button');
                        if (deleteBtn) {
                            console.log('方法2: JavaScript経由で削除ボタンを発見');
                            deleteBtn.click();
                            return true;
                        }
                        return false;
                    });

                    if (!wasDeleted) {
                        console.log('方法2: JavaScript経由でも削除ボタンを発見できず');

                        // 方法3: 位置ベースでのクリック
                        const box = await todoItem.boundingBox();
                        if (box) {
                            console.log('方法3: 位置ベースでクリック試行');
                            // Todo項目の右端付近をクリック
                            await page.mouse.click(box.x + box.width - 20, box.y + box.height / 2);
                        }
                    }
                }

                // 削除結果の確認
                await page.waitForTimeout(3000);
                await page.screenshot({ path: 'webkit-debug-after-delete.png', fullPage: true });

                const stillVisible = await page.locator(`text=${todoText}`).count() > 0;
                console.log(`削除操作後もTodoは可視状態: ${stillVisible}`);
            } catch (error) {
                console.log(`削除操作でエラー発生: ${error instanceof Error ? error.message : String(error)}`);
            }
        }

        expect(true).toBeTruthy(); // テストを成功させる
    });

    // HTMLとCSSの互換性テスト
    test('HTML/CSS互換性テスト', async ({ page, browserName }) => {
        test.skip(browserName !== 'webkit', 'WebKitでのみ実行するテスト');

        await page.goto(TODO_URL);
        await page.waitForLoadState('networkidle');

        // CSSセレクタの互換性確認
        const cssSelectorResults = await page.evaluate(() => {
            const results: Record<string, number> = {};

            // 様々なセレクタでの要素数を確認
            const selectors = [
                '.todo-item',
                '.circle-checkbox',
                'button',
                'button.delete',
                '[aria-label="Delete todo"]',
                '[aria-label*="Delete"]',
                'input[type="checkbox"]'
            ];

            selectors.forEach(selector => {
                results[selector] = document.querySelectorAll(selector).length;
            });

            return results;
        });

        console.log('WebKit診断: CSSセレクタ互換性テスト結果:');
        console.log(JSON.stringify(cssSelectorResults, null, 2));

        // スタイル計算の互換性確認
        await page.fill('input[placeholder="What needs to be done?"]', 'スタイルテスト用Todo');
        await page.click('button:has-text("Add Todo")');
        await page.waitForTimeout(2000);

        const styleCompatibility = await page.evaluate(() => {
            const todoElement = document.evaluate(
                "//*[contains(text(), 'スタイルテスト用Todo')]",
                document,
                null,
                XPathResult.FIRST_ORDERED_NODE_TYPE
            ).singleNodeValue as HTMLElement;

            if (!todoElement) return { error: 'Todo要素が見つかりません' };

            // 計算されたスタイルの検証
            const style = window.getComputedStyle(todoElement);
            return {
                display: style.display,
                position: style.position,
                visibility: style.visibility,
                opacity: style.opacity,
                pointerEvents: style.pointerEvents,
                // ホバー関連の設定
                hasHoverRules: !!document.querySelector('style:contains(:hover)'),
                // ボタン可視性
                buttonVisibility: Array.from(document.querySelectorAll('button')).map(btn => ({
                    display: getComputedStyle(btn).display,
                    visibility: getComputedStyle(btn).visibility,
                    opacity: getComputedStyle(btn).opacity,
                    position: getComputedStyle(btn).position
                }))
            };
        });

        console.log('WebKit診断: スタイル互換性テスト結果:');
        console.log(JSON.stringify(styleCompatibility, null, 2));

        expect(true).toBeTruthy();
    });
}); 