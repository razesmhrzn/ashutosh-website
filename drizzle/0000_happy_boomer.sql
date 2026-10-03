CREATE TABLE `enquiries` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`client_token` text NOT NULL,
	`kind` text NOT NULL,
	`full_name` text NOT NULL,
	`organization` text NOT NULL,
	`email` text NOT NULL,
	`phone` text,
	`enquiry_type` text,
	`category` text,
	`product` text,
	`business_type` text,
	`business_website` text,
	`message` text NOT NULL,
	`preferred_date` text,
	`preferred_time` text,
	`timezone` text,
	`additional_notes` text,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `enquiries_client_token_unique` ON `enquiries` (`client_token`);