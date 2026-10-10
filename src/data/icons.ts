/**
 * A honlapon használt Material Symbols ikonok – EGY helyen.
 *
 * A BaseLayout csak ezeket kéri le a Google-től (`icon_names`): ~50 KB a teljes,
 * ~1,1 MB-os ikonfont helyett. Ami nincs a listában, annak a helyén a NEVE
 * jelenik meg szövegként („check_circle").
 *
 * ÚJ IKONNÁL bővítsd a listát. A build (`src/integrations/icon-check.mjs`)
 * minden oldal HTML-jét átnézi, és megáll, ha olyan ikont talál, ami nincs itt.
 * Amit csak JS ír be futás közben, azt a build nem látja – azokat a lista
 * végén külön soroltuk fel; ilyet felvenni kézzel kell.
 */
export const ICONS: string[] = [
  'add', 'add_business', 'add_circle', 'ads_click', 'animation', 'arrow_back', 'arrow_downward', 'arrow_forward',
  'arrow_upward', 'article', 'aspect_ratio', 'auto_awesome', 'auto_fix_high', 'autorenew', 'balance', 'block', 'bolt',
  'build', 'calculate', 'calendar_month', 'calendar_view_month', 'call_split', 'campaign', 'cancel', 'category', 'chat',
  'check', 'check_circle', 'checklist', 'chevron_left', 'chevron_right', 'close', 'closed_caption', 'compare',
  'compare_arrows', 'content_copy', 'credit_card', 'credit_card_off', 'dashboard', 'design_services', 'diversity_3',
  'done_all', 'drag_indicator', 'eco', 'edit_calendar', 'edit_document', 'edit_note', 'emoji_events', 'emoji_objects',
  'event_busy', 'event_repeat', 'expand_more', 'explore', 'extension', 'face', 'fact_check', 'filter_alt', 'folder',
  'format_list_bulleted', 'format_quote', 'forum', 'forward_to_inbox', 'grid_on', 'grid_view', 'group', 'groups',
  'headphones', 'help', 'help_center', 'history', 'home', 'hub', 'image', 'info', 'insights', 'inventory',
  'inventory_2', 'leaderboard', 'link', 'link_off', 'location_on', 'lock', 'lock_open', 'login', 'mail',
  'mark_email_read', 'menu', 'menu_book', 'money_off', 'monitoring', 'move_down', 'movie', 'movie_filter', 'music_note',
  'open_in_new', 'page_control', 'palette', 'pause_circle', 'payments', 'person_search', 'photo_library', 'play_circle',
  'precision_manufacturing', 'progress_activity', 'psychology', 'public', 'publish', 'query_stats', 'quiz',
  'receipt_long', 'record_voice_over', 'remove', 'rocket_launch', 'rule', 'savings', 'schedule', 'schedule_send',
  'school', 'script', 'search', 'sell', 'send', 'sentiment_dissatisfied', 'settings_suggest', 'share', 'shield',
  'shield_lock', 'shield_person', 'shopping_bag', 'shopping_cart', 'smart_toy', 'sort', 'stacked_bar_chart', 'stacks',
  'stay_current_portrait', 'storefront', 'support_agent', 'swap_horiz', 'swap_vert', 'sync', 'sync_alt', 'thumb_up',
  'timeline', 'timer', 'touch_app', 'translate', 'travel_explore', 'trending_down', 'trending_up', 'tune', 'upcoming',
  'upload', 'upload_file', 'verified', 'verified_user', 'vertical_align_top', 'view_carousel', 'visibility',
  'wallpaper', 'wb_sunny',
  // Csak JS írja be futás közben (a build nem látja):
  'volume_off', 'volume_up', // DemoVideo hangkapcsoló
  // 'menu', 'close' (Header), 'progress_activity', 'check_circle' (HeroScene),
  // a CTA-sáv úszó ikonjai (MotionScript): share, article, mail, image, movie,
  // edit_document – fent már szerepelnek.
];
