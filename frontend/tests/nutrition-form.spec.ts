import { test, expect } from '@playwright/test';

test('success case', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.getByRole('link', { name: '🥗 โภชนาการที่เหมาะกับคุณ วิเคราะห์โภชนาการส่วนบุคคล' }).click();
  await page.locator('#rc_select_1').click();
  await page.getByText('👨 ชาย').click();
  await page.locator('span').filter({ hasText: 'ปี' }).first().click();
  await page.getByPlaceholder('กรอกอายุ (ปี)').fill('15');
  await page.locator('label').filter({ hasText: '🩺 เบาหวาน' }).click();
  await page.locator('span').filter({ hasText: 'ซม' }).first().click();
  await page.getByPlaceholder('กรอกส่วนสูง (ซม.)').fill('150');
  await page.getByRole('button', { name: 'check-circle' }).click();
});

test('gender skipped', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.getByRole('link', { name: '🥗 โภชนาการที่เหมาะกับคุณ วิเคราะห์โภชนาการส่วนบุคคล' }).click();
  await page.getByPlaceholder('กรอกอายุ (ปี)').click();
  await page.getByPlaceholder('กรอกอายุ (ปี)').fill('15');
  await page.getByRole('radio', { name: '🫘 โรคไต' }).check();
  await page.locator('#rc_select_3').click();
  await page.getByText('📊 ระยะ 1-3a').click();
  await page.getByPlaceholder('กรอกส่วนสูง (ซม.)').click();
  await page.getByPlaceholder('กรอกส่วนสูง (ซม.)').fill('148');
   // Hover over the submit button to trigger the tooltip
  await page.getByRole('button', { name: 'check-circle' }).hover();

  // Assert that the tooltip is visible with the expected text
  const tooltip = page.getByRole('tooltip', { name: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
  await expect(tooltip).toBeVisible(); 
});

test('age skipped', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.getByRole('link', { name: '🥗 โภชนาการที่เหมาะกับคุณ วิเคราะห์โภชนาการส่วนบุคคล' }).click();
  await page.locator('#rc_select_1').click();
  await page.getByText('👨 ชาย').click();
  await page.getByPlaceholder('กรอกส่วนสูง (ซม.)').click();
  await page.getByPlaceholder('กรอกส่วนสูง (ซม.)').fill('150');
  await page.getByRole('radio', { name: '🩺 เบาหวาน' }).check();
  await page.getByRole('button', { name: 'check-circle' }).hover();
  const tooltip = page.getByRole('tooltip', { name: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
  await expect(tooltip).toBeVisible(); 
});

test('age under 15', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.getByRole('link', { name: '🥗 โภชนาการที่เหมาะกับคุณ วิเคราะห์โภชนาการส่วนบุคคล' }).click();
  await page.locator('#rc_select_1').click();
  await page.locator('div').filter({ hasText: 'malefemale👨 ชาย👩 หญิง' }).nth(1).click();
  await page.getByPlaceholder('กรอกส่วนสูง (ซม.)').click();
  await page.getByPlaceholder('กรอกส่วนสูง (ซม.)').fill('150');
  await page.getByRole('radio', { name: '🩺 เบาหวาน' }).check();
  await page.getByPlaceholder('กรอกอายุ (ปี)').click();
  await page.getByPlaceholder('กรอกอายุ (ปี)').fill('14');
  page.once('dialog', dialog => {
  expect(dialog.message()).toBe('อายุต้องไม่ต่ำกว่า 15 ปี');
  dialog.accept();
});

await page.getByRole('button', { name: 'check-circle' }).click();
});

test('height skipped', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.getByRole('link', { name: '🥗 โภชนาการที่เหมาะกับคุณ วิเคราะห์โภชนาการส่วนบุคคล' }).click();
  await page.locator('#rc_select_1').click();
  await page.getByText('👩 หญิง').click();
  await page.getByPlaceholder('กรอกอายุ (ปี)').click();
  await page.getByPlaceholder('กรอกอายุ (ปี)').fill('120');
  await page.locator('div').filter({ hasText: /^🩺 เบาหวาน$/ }).click();
  await page.getByRole('button', { name: 'check-circle' }).hover();
  const tooltip = page.getByRole('tooltip', { name: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
  await expect(tooltip).toBeVisible(); 
});

test('height less than 3 digits', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.getByRole('link', { name: '🥗 โภชนาการที่เหมาะกับคุณ วิเคราะห์โภชนาการส่วนบุคคล' }).click();
  await page.locator('#rc_select_1').click();
  await page.getByText('👨 ชาย').click();
  await page.locator('span').filter({ hasText: 'ปี' }).first().click();
  await page.getByPlaceholder('กรอกอายุ (ปี)').fill('50');
  await page.getByPlaceholder('กรอกส่วนสูง (ซม.)').click();
  await page.getByPlaceholder('กรอกส่วนสูง (ซม.)').fill('10');
  await page.getByText('🩺 เบาหวาน').click();
  page.once('dialog', dialog => {
    expect(dialog.message()).toBe('ส่วนสูงต้องเป็นตัวเลข 3 หลัก (เช่น 150 ซม.)');
  dialog.accept();
  });
  await page.getByRole('button', { name: 'check-circle' }).click();
});

test('height more than 3 digits', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.getByRole('link', { name: '🥗 โภชนาการที่เหมาะกับคุณ วิเคราะห์โภชนาการส่วนบุคคล' }).click();
  await page.getByPlaceholder('กรอกส่วนสูง (ซม.)').click();
  await page.getByPlaceholder('กรอกส่วนสูง (ซม.)').fill('1203');
  await page.locator('#rc_select_1').click();
  await page.getByText('👩 หญิง').click();
  await page.getByPlaceholder('กรอกอายุ (ปี)').click();
  await page.getByPlaceholder('กรอกอายุ (ปี)').fill('59');
  await page.locator('div').filter({ hasText: /^🫘 โรคไต$/ }).click();
  await page.locator('#rc_select_3').click();
  await page.getByText('📊 ระยะ 3b-').click();
  page.once('dialog', dialog => {
    expect(dialog.message()).toBe('ส่วนสูงต้องเป็นตัวเลข 3 หลัก (เช่น 150 ซม.)');
  dialog.accept();
  });
  await page.getByRole('button', { name: 'check-circle' }).click();
});

test('disease skipped', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.getByRole('link', { name: '🥗 โภชนาการที่เหมาะกับคุณ วิเคราะห์โภชนาการส่วนบุคคล' }).click();
  await page.locator('#rc_select_1').click();
  await page.getByText('👩 หญิง').click();
  await page.getByPlaceholder('กรอกอายุ (ปี)').click();
  await page.getByPlaceholder('กรอกอายุ (ปี)').fill('59');
  await page.getByPlaceholder('กรอกส่วนสูง (ซม.)').click();
  await page.getByPlaceholder('กรอกส่วนสูง (ซม.)').fill('180');
  await page.getByRole('button', { name: 'check-circle' }).hover();
  const tooltip = page.getByRole('tooltip', { name: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
  await expect(tooltip).toBeVisible(); 
});

test('kidney stage skipped', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.getByRole('link', { name: '🥗 โภชนาการที่เหมาะกับคุณ วิเคราะห์โภชนาการส่วนบุคคล' }).click();
  await page.locator('#rc_select_1').click();
  await page.getByText('👩 หญิง').click();
  await page.getByPlaceholder('กรอกส่วนสูง (ซม.)').click();
  await page.getByPlaceholder('กรอกส่วนสูง (ซม.)').fill('160');
  await page.getByPlaceholder('กรอกอายุ (ปี)').click();
  await page.getByPlaceholder('กรอกอายุ (ปี)').fill('50');
  await page.getByRole('radio', { name: '🫘 โรคไต' }).check();
  await page.getByRole('button', { name: 'check-circle' }).hover();
  const tooltip = page.getByRole('tooltip', { name: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
  await expect(tooltip).toBeVisible(); 
});