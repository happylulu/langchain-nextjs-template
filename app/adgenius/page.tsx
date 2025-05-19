import { ChatWindow } from "@/components/ChatWindow";
import { GuideInfoBox } from "@/components/guide/GuideInfoBox";

export default function AdGeniusPage() {
  const InfoCard = (
    <GuideInfoBox>
      <ul>
        <li className="text-l">
          💡<span className="ml-2">Chat with AdGenius to build your Google Ads campaigns.</span>
        </li>
        <li className="hidden text-l md:block">
          💻<span className="ml-2">Prompt logic located in <code>app/api/adgenius/route.ts</code>.</span>
        </li>
        <li className="text-l">
          👇<span className="ml-2">Ask for keywords, budgets, or ad copy ideas!</span>
        </li>
      </ul>
    </GuideInfoBox>
  );

  return (
    <ChatWindow
      endpoint="api/adgenius"
      emptyStateComponent={InfoCard}
      placeholder="Ask AdGenius for help with your ad campaign..."
      emoji="💼"
    />
  );
}
