import { Component, ElementRef, HostListener, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-emoji-picker',
  imports: [],
  templateUrl: './emoji-picker.html',
  styleUrl: './emoji-picker.css',
  host: { class: 'join-item' }
})
export class EmojiPicker {

  value = input<string>('😀');
  valueChange = output<string>();

  readonly emojiList = [
    '🏠', '⚡', '📡', '🚗', '🏥', '🧾', '🚌',
    '🛒', '🍽️', '☕', '🍔', '🎉', '🎬', '🎮',
    '🎵', '🧑‍🤝‍🧑', '👕', '🛍️', '📱', '💄', '🛋️',
    '🧹', '🔧', '🏋️', '🧘', '💊', '📺', '☁️',
    '🎧', '🎁', '✈️', '❓', '📦', '🧠', '🐶'
  ];

  showEmojiPicker = signal(false);

  constructor(private elementRef: ElementRef) {}

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.showEmojiPicker.set(false);
    }
  }

  toggleEmojiPicker() {
    this.showEmojiPicker.update(v => !v);
  }

  selectEmoji(emoji: string) {
    this.valueChange.emit(emoji);
    this.showEmojiPicker.set(false);
  }
}
