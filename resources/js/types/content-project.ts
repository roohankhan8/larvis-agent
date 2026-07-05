export type ContentProject = {
    id: number;
    title: string;
    source_content: string | null;
    content_type: string | null;
    audience: string | null;
    tone: string | null;
    goal: string | null;
    status: string;
    current_draft: string | null;
    latest_analysis: {
        title?: string | null;
        category?: string | null;
        summary?: string | null;
        tags?: string[];
    } | null;
    model_settings: Record<string, unknown> | null;
    drafts: Array<{
        id: string;
        label: string;
        content: string;
        source: string;
        created_at: string;
        metadata?: Record<string, unknown>;
    }>;
    conversation_id: string | null;
    final_output: string | null;
    updated_at: string | null;
};
