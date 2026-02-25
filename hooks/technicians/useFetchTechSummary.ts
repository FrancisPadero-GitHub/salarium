
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export type TechnicianSummary = {
	technician_id: string;
	name: string;
	email: string | null;
	phone: string | null;
	hired_date: string | null;
	commission_rate: number;

	total_jobs: number;
	total_gross: number;
	total_parts_cost: number;
	total_net: number;
	total_earned: number;
};

const fetchTechSummary = async (): Promise<TechnicianSummary[]> => {
	const { data, error } = await supabase
		.from("v_technician_summary")
		.select("*");

	if (error) {
		throw new Error(error.message || "Failed to fetch technician summary");
	}

	return (data ?? []) as TechnicianSummary[];
};

export function useFetchTechSummary() {
	return useQuery<TechnicianSummary[], Error>({
		queryKey: ["technicians", "summary"],
		queryFn: fetchTechSummary,
		staleTime: 1000 * 60 * 2, // 2 minutes
		retry: 1,
	});
}

