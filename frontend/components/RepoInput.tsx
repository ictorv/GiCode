"use client";

export default function RepoInput({
    repos,
    setRepos,
}: {
    repos: string[];
    setRepos: (repos: string[]) => void;
}) {
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const list = e.target.value
            .split("\n")
            .map((r) => r.trim())
            .filter(Boolean);

        setRepos(list);
    };

    return (
        <textarea
            placeholder="owner/repo (one per line)"
            rows={5}
            style={{ width: "100%", padding: "10px" }}
            onChange={handleChange}
        />
    );
}